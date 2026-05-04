import crypto from 'node:crypto';
import { Op } from 'sequelize';
import { RecuperacaoSenha, Usuario } from '../models/index.js';
import enviarEmail from '../services/sendmail.js';

function normalizarEmail(email) {
    return String(email ?? '').trim().toLowerCase();
}

function gerarCodigoRecuperacao() {
    return String(crypto.randomInt(100000, 999999));
}

function hashSenha(senha) {
    return crypto.createHash('sha256').update(senha).digest('hex');
}

export async function solicitarRecuperacao(req, res) {
    try {
        const email = normalizarEmail(req.body?.email);

        if (!email) {
            return res.status(400).json({ message: 'Informe um e-mail válido.' });
        }

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(200).json({
                message: 'Se o e-mail existir no sistema, um código de recuperação será enviado.',
            });
        }

        const codigo = gerarCodigoRecuperacao();
        const expiraEm = new Date(Date.now() + 15 * 60 * 1000);

        const emailEnviado = await enviarEmail(
            'Sabor Comida',
            usuario.email,
            'Código de recuperação de senha',
            `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
                    <h2 style="margin: 0 0 12px; color: #f97316;">Recuperação de senha</h2>
                    <p>Olá, ${usuario.nome}.</p>
                    <p>Use o código abaixo para redefinir sua senha no Sabor Comida:</p>
                    <div style="margin: 24px 0; padding: 16px 20px; display: inline-block; border-radius: 14px; background: #fff7ed; border: 1px solid #fdba74; font-size: 28px; font-weight: 700; letter-spacing: 6px;">
                        ${codigo}
                    </div>
                    <p>Esse código expira em 15 minutos.</p>
                </div>
            `,
        );

        await RecuperacaoSenha.create({
            email_destino: usuario.email,
            codigo_verificacao: codigo,
            expira_em: expiraEm,
            status: emailEnviado ? 'enviado' : 'falha_envio',
            idUsuario: usuario.id,
        });

        if (!emailEnviado) {
            return res.status(500).json({ message: 'Não foi possível enviar o e-mail de recuperação.' });
        }

        return res.status(200).json({
            message: 'Código de recuperação enviado com sucesso.',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao solicitar recuperação de senha.' });
    }
}

export async function redefinirSenha(req, res) {
    try {
        const email = normalizarEmail(req.body?.email);
        const codigo = String(req.body?.codigo ?? '').trim();
        const novaSenha = String(req.body?.novaSenha ?? '').trim();

        if (!email || !codigo || !novaSenha) {
            return res.status(400).json({ message: 'Informe e-mail, código e nova senha.' });
        }

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ message: 'Código inválido ou expirado.' });
        }

        const solicitacao = await RecuperacaoSenha.findOne({
            where: {
                email_destino: email,
                codigo_verificacao: codigo,
                status: 'enviado',
                usado_em: { [Op.is]: null },
                expira_em: { [Op.gt]: new Date() },
            },
            order: [['created_at', 'DESC']],
        });

        if (!solicitacao) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        usuario.passwordHash = hashSenha(novaSenha);
        await usuario.save();

        solicitacao.usado_em = new Date();
        solicitacao.status = 'utilizado';
        await solicitacao.save();

        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao redefinir a senha.' });
    }
}