import Link from "next/link";
import Image from "next/image";
import { getRestaurants, getRestaurantAddressLabel, getRestaurantImage } from "../../lib/api";
import { MdStorefront, MdOutlineDeliveryDining } from "react-icons/md";

const steps = [
  {
    title: "1. Cadastro completo",
    description: "Nome, CNPJ, descrição, banner, logo, horário e endereço principal.",
    href: "/restaurante/cadastro",
    icon: MdStorefront,
  },
  {
    title: "2. Operação futura",
    description: "Cardápio, pedidos e configurações serão liberados depois.",
    href: "/restaurante/cadastro",
    icon: MdOutlineDeliveryDining,
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