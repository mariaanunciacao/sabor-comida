import Link from "next/link";
import Image from "next/image";
import { restaurantes } from "../restaurants-data";

export default function Page() {
  return (
    <main className="flex-1 bg-(--color-fundo-app) px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <section>
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
            <Link
              key={restaurante.name}
              href={`/restaurante-perfil?restaurant=${restaurante.slug}`}
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
                  <span className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-sm font-semibold text-white transition duration-300 group-hover:opacity-95">
                    Ver menu
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}