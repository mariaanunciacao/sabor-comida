import Image from "next/image";

const restaurantes = [
  {
    name: "Padaria Doce Pão",
    category: "Padarias",
    description: "Pães, bolos e café passado na hora.",
    status: "Aberto",
    badge: "⭐4.9",
    logo: "/logos/padaria-doce-pao.svg",
    banner: "/banners/padaria-doce-pao.svg",
  },
  {
    name: "Cores e Sabores",
    category: "Doces",
    description: "Sobremesas, brigadeiros e kits presenteáveis.",
    status: "Aberto",
    badge: "⭐4.8",
    logo: "/logos/cores-e-sabores.svg",
    banner: "/banners/cores-e-sabores.svg",
  },
  {
    name: "Fogão da Fran",
    category: "Marmitas",
    description: "Pratos feitos e marmitas executivas do dia.",
    status: "Aberto",
    badge: "⭐4.7",
    logo: "/logos/fogao-da-fran.svg",
    banner: "/banners/fogao-da-fran.svg",
  },
  {
    name: "Veg Saladas",
    category: "Saudáveis",
    description: "Bowls, saladas frescas e opções leves.",
    status: "Aberto",
    badge: "⭐4.9",
    logo: "/logos/veg-saladas.svg",
    banner: "/banners/veg-saladas.svg",
  },
  {
    name: "Panda Sushi",
    category: "Japonesa",
    description: "Combos, temakis e hot rolls bem montados.",
    status: "Aberto",
    badge: "⭐4.8",
    logo: "/logos/panda-sushi.svg",
    banner: "/banners/panda-sushi.svg",
  },
  {
    name: "Pizzaria da Família",
    category: "Pizzas",
    description: "Pizzas artesanais com borda recheada.",
    status: "Fechado",
    badge: "⭐4.6",
    logo: "/logos/pizzaria-da-familia.svg",
    banner: "/banners/pizzaria-da-familia.svg",
  },
  {
    name: "Burger King",
    category: "Lanches",
    description: "Hambúrgueres frescos.",
    status: "Fechado",
    badge: "⭐4.1",
    logo: "/logos/burger-king.svg",
    banner: "/banners/burger-king.svg",
  },
  {
    name: "Churrascaria do Joelso",
    category: "Carnes",
    description: "Carne na chapa.",
    status: "Fechado",
    badge: "⭐5.0",
    logo: "/logos/churrascaria-do-joelso.svg",
    banner: "/banners/churrascaria-do-joelso.svg",
  },
  {
    name: "Pizzaria Nativa",
    category: "Pizzas",
    description: "Pizzas de diversos tamanhos para toda a família.",
    status: "Fechado",
    badge: "⭐4.6",
    logo: "/logos/pizzaria-nativa.svg",
    banner: "/banners/pizzaria-nativa.svg",
  },
];

export default function Page() {
  return (
    <main className="flex-1 bg-(--color-fundo-app) px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-(--color-titulos)">
                Explore os restaurantes disponíveis
              </h1>
            </div>

            <div className="w-full max-w-sm">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500" htmlFor="restaurant-filter">
                Filtros
              </label>
              <div className="relative">
                <select
                  id="restaurant-filter"
                  className="select w-full appearance-none rounded-2xl border border-orange-100 bg-white/95 px-4 py-3 pr-10 text-sm text-gray-700 shadow-sm outline-none transition duration-300 focus:border-(--color-botao-pesquisa) focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
                  defaultValue=""
                >
                  <option value="" disabled>Todos os filtros</option>
                  <option value="all">Todos</option>
                  <option value="open">Abertos Agora</option>
                  <option value="delivery">Entrega Rápida</option>
                  <option value="cheap">Menor Preço</option>
                  <option value="near">Perto de Você</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {restaurantes.map((restaurante) => (
            <article
              key={restaurante.name}
              className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/85 shadow-[0_14px_40px_rgba(249,115,22,0.10)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(245,128,103,0.22)]"
            >
              <div className="relative h-36 overflow-hidden transition duration-300 group-hover:opacity-95">
                <Image
                  src={restaurante.banner}
                  alt={`${restaurante.name} banner`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/90 shadow-sm transition duration-300 group-hover:scale-105">
                  <Image
                    src={restaurante.logo}
                    alt={restaurante.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                  {restaurante.badge}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 transition group-hover:text-(--color-titulos)">
                      {restaurante.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">{restaurante.category}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      restaurante.status === "Aberto"
                        ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                    }`}
                  >
                    {restaurante.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">{restaurante.description}</p>

                <div className="mt-5 flex items-center justify-between">
                  <button className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:opacity-90">
                    Ver menu
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}