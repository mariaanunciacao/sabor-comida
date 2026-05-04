import Link from "next/link";
import Image from "next/image";
import { getRestaurants, getRestaurantAddressLabel, getRestaurantImage } from "../../lib/api";
import { MdStorefront, MdRestaurantMenu, MdListAlt, MdOutlineDeliveryDining } from "react-icons/md";

const steps = [
  {
    title: "1. Cadastro básico",
    description: "Nome, CNPJ, descrição, banner, logo e horário de funcionamento.",
    href: "/restaurante/cadastro",
    icon: MdStorefront,
  },
  {
    title: "2. Endereço",
    description: "Cadastre a localização principal e ajuste a área de atendimento.",
    href: "/restaurante/endereco",
    icon: MdOutlineDeliveryDining,
  },
  {
    title: "3. Cardápio",
    description: "Crie menus, categorias e produtos para vender no app.",
    href: "/restaurante/cardapio",
    icon: MdRestaurantMenu,
  },
  {
    title: "4. Operação",
    description: "Acompanhe pedidos e decisões do dia a dia do restaurante.",
    href: "/restaurante/pedidos",
    icon: MdListAlt,
  },
];

export default async function Page({ searchParams }) {
  let restaurantes = [];

  try {
    restaurantes = await getRestaurants();
  } catch {
    restaurantes = [];
  }

  const totalRestaurantes = restaurantes.length;
  const totalCategorias = new Set(restaurantes.flatMap((restaurante) => (restaurante.categorias ?? []).map((categoria) => categoria.id))).size;
  const totalMenus = restaurantes.reduce((count, restaurante) => count + (restaurante.menus?.length ?? 0), 0);
  const totalProdutos = restaurantes.reduce((count, restaurante) => count + (restaurante.produtos?.length ?? 0), 0);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const selectedRestaurantId = Number(resolvedSearchParams?.restaurantId);
  const destaque = Number.isInteger(selectedRestaurantId) && selectedRestaurantId > 0
    ? restaurantes.find((restaurante) => Number(restaurante.id) === selectedRestaurantId) ?? restaurantes[0] ?? null
    : restaurantes[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-500 via-amber-400 to-amber-200 text-white shadow-[0_20px_60px_rgba(249,115,22,0.18)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/80">Área do restaurante</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Comece a operar o seu restaurante no Sabor Comida</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
              Este painel vai centralizar o cadastro, o cardápio e os pedidos. O primeiro passo é preencher os dados do restaurante e depois abrir o menu para venda.
            </p>

            {destaque ? (
              <div className="mt-5 rounded-[1.5rem] border border-white/25 bg-white/15 p-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/75">Restaurante ativo</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${destaque.statusAprovacao === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : destaque.statusAprovacao === 'rejeitado' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                    {destaque.statusAprovacao === 'aprovado' ? 'Aprovado' : destaque.statusAprovacao === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold">{destaque.nome_restaurante}</p>
                <p className="text-sm text-white/85">{getRestaurantAddressLabel(destaque)}</p>
                <p className="mt-2 text-sm text-white/85">
                  {destaque.statusAprovacao === 'aprovado'
                    ? 'Seu restaurante já pode seguir para cardápio e operação.'
                    : destaque.statusAprovacao === 'rejeitado'
                      ? 'O cadastro foi rejeitado. Ajuste os dados na tela de cadastro.'
                      : 'Seu cadastro está aguardando aprovação do administrador.'}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/restaurante/cadastro" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-orange-700 shadow-sm transition hover:-translate-y-0.5">
                Começar cadastro
              </Link>
              <Link href="/restaurante/cardapio" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Ver cardápio
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white/15 p-4 backdrop-blur-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Restaurantes" value={totalRestaurantes} />
              <MetricCard label="Categorias" value={totalCategorias} />
              <MetricCard label="Menus" value={totalMenus} />
              <MetricCard label="Produtos" value={totalProdutos} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Fluxo inicial</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Passo a passo para colocar o restaurante no ar</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <Link key={step.title} href={step.href} className="group rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Destaque do banco</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Primeiro restaurante cadastrado</h2>
            </div>
          </div>

          {destaque ? (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-sm">
              <div className="relative h-44">
                <Image src={getRestaurantImage(destaque, 'banner')} alt={destaque.nome_restaurante} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{destaque.nome_restaurante}</h3>
                    <p className="mt-1 text-sm text-slate-500">{getRestaurantAddressLabel(destaque)}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Ativo</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-white">
                    <Image src={getRestaurantImage(destaque)} alt={destaque.nome_restaurante} width={48} height={48} className="h-full w-full object-cover" unoptimized />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">Descrição</p>
                    <p className="text-sm text-slate-700">{destaque.descricao ?? 'Sem descrição cadastrada ainda.'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50 p-6 text-sm text-slate-600">
              Nenhum restaurante foi encontrado no banco ainda.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Lista do banco</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Restaurantes cadastrados</h2>
          </div>
          <Link href="/restaurante/cadastro" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
            Novo restaurante
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {restaurantes.map((restaurante) => (
            <article key={restaurante.id} className={`overflow-hidden rounded-[1.5rem] border bg-orange-50/50 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${destaque?.id === restaurante.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-orange-100'}`}>
              <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr]">
                <div className="relative h-28 overflow-hidden rounded-2xl bg-white">
                  <Image src={getRestaurantImage(restaurante, 'banner')} alt={restaurante.nome_restaurante} fill className="object-cover" unoptimized />
                </div>

                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{restaurante.nome_restaurante}</h3>
                      <p className="text-sm text-slate-500">CNPJ {restaurante.cnpj}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">#{restaurante.id}</span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{getRestaurantAddressLabel(restaurante)}</p>
                  <p className="mt-1 text-sm text-slate-600">Horário: {restaurante.horario_atendimento}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/restaurante?restaurantId=${restaurante.id}`} className="rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700">
                      Entrar como este restaurante
                    </Link>
                    <Link href="/restaurante/cadastro" className="rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700">
                      Editar cadastro
                    </Link>
                    <Link href="/restaurante/cardapio" className="rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700">
                      Cardápio
                    </Link>
                    <Link href="/restaurante/pedidos" className="rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-700">
                      Pedidos
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/20 bg-white/15 p-4 text-white">
      <p className="text-xs uppercase tracking-[0.22em] text-white/70">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}