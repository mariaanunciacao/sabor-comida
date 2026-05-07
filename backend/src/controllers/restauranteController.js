import {
  Restaurante,
  RestauranteEndereco,
  Usuario,
  Menu,
  Produto,
  Categoria,
  sequelize,
} from '../models/index.js';

const ALLOWED_USER_TYPES = ['restaurante_pendente', 'restaurante', 'admin'];

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function isValidCnpj(value) {
  return normalizeDigits(value).length === 14;
}

function isCompleteAddress(payload) {
  return ['logradouro', 'numero', 'cep', 'cidade', 'estado'].every(
    (field) => normalizeText(payload?.[field]).length > 0
  );
}

function toPlainRestaurant(restaurante) {
  const data = restaurante.toJSON();

  const enderecos = data.enderecos_restaurante ?? [];
  const categorias = data.categorias ?? [];

  const menus = (data.menus ?? []).map((menu) => ({
    ...menu,
    produtos: (menu.produtos ?? []).filter(
      (produto) => produto.ativo !== false
    ),
  }));

  const produtos = menus
    .flatMap((menu) =>
      (menu.produtos ?? []).map((produto) => ({
        ...produto,
        menuId: menu.id,
        menuNome: menu.nome_menu,
      }))
    )
    .sort((produtoA, produtoB) => Number(produtoA.id) - Number(produtoB.id));

  return {
    ...data,
    logoUrl: data.logo_path ?? null,
    bannerUrl: data.banner_path ?? null,
    statusAprovacao: data.status_aprovacao ?? 'pendente',
    enderecoPrincipal: enderecos[0] ?? null,
    enderecos,
    categorias,
    menus,
    produtos,
  };
}

const restaurantInclude = [
  {
    model: RestauranteEndereco,
    as: 'enderecos_restaurante',
    attributes: ['id', 'logradouro', 'cep', 'numero', 'cidade', 'estado'],
  },

  {
    model: Categoria,
    as: 'categorias',
    through: { attributes: [] },
  },

  {
    model: Menu,
    as: 'menus',
    include: [
      {
        model: Produto,
        as: 'produtos',
        include: [
          {
            model: Categoria,
            as: 'categoria',
          },
        ],
      },
    ],
  },
];

function buildRestaurantResponse(restaurante, usuario) {
  if (!restaurante) {
    return {
      restaurante: null,
      statusAprovacao: 'pendente',
      message: 'Nenhum cadastro de restaurante foi enviado ainda.',
      usuario: usuario
        ? {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
          }
        : null,
    };
  }

  const plainRestaurant = toPlainRestaurant(restaurante);

  const statusAprovacao =
    plainRestaurant.statusAprovacao ?? 'pendente';

  let message = 'Cadastro em análise.';

  if (statusAprovacao === 'aprovado') {
    message = 'Seu restaurante foi aprovado.';
  } else if (statusAprovacao === 'rejeitado') {
    message =
      'Seu cadastro foi rejeitado. Você pode revisar os dados e reenviar.';
  }

  return {
    restaurante: plainRestaurant,
    statusAprovacao,
    message,
    usuario: usuario
      ? {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo,
        }
      : null,
  };
}

async function loadCurrentRestaurant(userId) {
  return Restaurante.findOne({
    where: { idUsuario: userId },
    include: restaurantInclude,
  });
}

export async function listarRestaurantes(req, res) {
  const restaurantes = await Restaurante.findAll({
    where: { status_aprovacao: 'aprovado' },
    include: restaurantInclude,
    order: [['id', 'ASC']],
  });

  return res.json(restaurantes.map(toPlainRestaurant));
}

export async function listarRestaurantePorId(req, res) {
  const restauranteId = Number(req.params.id);

  if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
    return res
      .status(400)
      .json({ message: 'Informe um restauranteId válido.' });
  }

  const restaurante = await Restaurante.findOne({
    where: {
      id: restauranteId,
      status_aprovacao: 'aprovado',
    },
    include: restaurantInclude,
  });

  if (!restaurante) {
    return res
      .status(404)
      .json({ message: 'Restaurante não encontrado.' });
  }

  return res.json(toPlainRestaurant(restaurante));
}

export async function statusMeuRestaurante(req, res) {
  const tipoUsuario = String(
    req.auth?.tipo ?? req.auth?.perfil ?? ''
  ).trim();

  if (!ALLOWED_USER_TYPES.includes(tipoUsuario)) {
    return res.status(403).json({
      message:
        'Somente usuários de restaurante podem consultar este status.',
    });
  }

  const usuario = await Usuario.findByPk(req.auth.id_usuario);

  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const restaurante = await loadCurrentRestaurant(usuario.id);

  return res.json(buildRestaurantResponse(restaurante, usuario));
}

export async function meuRestaurante(req, res) {
  const tipoUsuario = String(
    req.auth?.tipo ?? req.auth?.perfil ?? ''
  ).trim();

  if (!ALLOWED_USER_TYPES.includes(tipoUsuario)) {
    return res.status(403).json({
      message:
        'Somente usuários de restaurante podem acessar este recurso.',
    });
  }

  const usuario = await Usuario.findByPk(req.auth.id_usuario);

  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const restaurante = await loadCurrentRestaurant(usuario.id);

  return res.json(buildRestaurantResponse(restaurante, usuario));
}

export async function atualizarMeuRestaurante(req, res) {
  const tipoUsuario = String(
    req.auth?.tipo ?? req.auth?.perfil ?? ''
  ).trim();

  if (!ALLOWED_USER_TYPES.includes(tipoUsuario)) {
    return res.status(403).json({
      message:
        'Somente usuários de restaurante podem enviar dados para análise.',
    });
  }

  const usuario = await Usuario.findByPk(req.auth.id_usuario);

  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  const nomeRestaurante = normalizeText(
    req.body?.nome_restaurante
  );

  const cnpj = normalizeText(req.body?.cnpj);

  const descricao = normalizeText(req.body?.descricao);

  const logoPath = normalizeText(req.body?.logo_path);

  const bannerPath = normalizeText(req.body?.banner_path);

  const horarioAtendimento = normalizeText(
    req.body?.horario_funcionamento ??
      req.body?.horario_atendimento
  );

  const tempoEntrega = normalizeText(req.body?.tempo_entrega);

  const enderecoPayload = {
    logradouro: normalizeText(req.body?.logradouro),
    numero: normalizeText(req.body?.numero),
    cep: normalizeText(req.body?.cep),
    cidade: normalizeText(req.body?.cidade),
    estado: normalizeText(req.body?.estado),
  };

  if (
    !nomeRestaurante ||
    !cnpj ||
    !horarioAtendimento ||
    !tempoEntrega ||
    !isCompleteAddress(enderecoPayload)
  ) {
    return res.status(400).json({
      message:
        'Informe nome do restaurante, CNPJ, horário, tempo de entrega e endereço completo.',
    });
  }

  if (!isValidCnpj(cnpj)) {
    return res.status(400).json({ message: 'CNPJ inválido.' });
  }

  const currentRestaurant = await loadCurrentRestaurant(usuario.id);

  const restaurante = await sequelize.transaction(
    async (transaction) => {
      let targetRestaurant = currentRestaurant;

      if (!targetRestaurant) {
        targetRestaurant = await Restaurante.create(
          {
            idUsuario: usuario.id,
            nome_restaurante: nomeRestaurante,
            cnpj,
            descricao: descricao || null,
            logo_path: logoPath || null,
            banner_path: bannerPath || null,
            horario_atendimento: horarioAtendimento,
            tempo_entrega: tempoEntrega,
            status_aprovacao: 'pendente',
          },
          { transaction }
        );
      } else {
        targetRestaurant.nome_restaurante =
          nomeRestaurante;

        targetRestaurant.cnpj = cnpj;

        targetRestaurant.descricao =
          descricao || null;

        targetRestaurant.logo_path =
          logoPath || null;

        targetRestaurant.banner_path =
          bannerPath || null;

        targetRestaurant.horario_atendimento =
          horarioAtendimento;

        targetRestaurant.tempo_entrega =
          tempoEntrega;

        targetRestaurant.status_aprovacao =
          'pendente';

        await targetRestaurant.save({ transaction });
      }

      const [endereco] =
        await RestauranteEndereco.findOrCreate({
          where: {
            idRestaurante: targetRestaurant.id,
          },
          defaults: {
            idRestaurante: targetRestaurant.id,
            ...enderecoPayload,
          },
          transaction,
        });

      endereco.logradouro =
        enderecoPayload.logradouro;

      endereco.numero =
        enderecoPayload.numero;

      endereco.cep =
        enderecoPayload.cep;

      endereco.cidade =
        enderecoPayload.cidade;

      endereco.estado =
        enderecoPayload.estado;

      await endereco.save({ transaction });

      await usuario.update(
        {
          tipo:
            usuario.tipo === 'admin'
              ? 'admin'
              : 'restaurante_pendente',
        },
        { transaction }
      );

      return targetRestaurant;
    }
  );

  const updatedRestaurant = await Restaurante.findByPk(
    restaurante.id,
    {
      include: restaurantInclude,
    }
  );

  const responsePayload = buildRestaurantResponse(
    updatedRestaurant,
    usuario
  );

  return res.json({
    message: 'Dados enviados para análise com sucesso.',
    ...responsePayload,
    statusMessage: responsePayload.message,
  });
}