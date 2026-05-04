import { getRestaurants, getRestaurantImage } from "../../../lib/api";
import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  let restaurantes = [];

  try {
    restaurantes = await getRestaurants();
  } catch {
    restaurantes = [];
  }

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
              key={restaurante.id}
              href={`/restaurante-perfil?restaurantId=${restaurante.id}`}
              className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/85 shadow-[0_14px_40px_rgba(249,115,22,0.10)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(245,128,103,0.22)]"
            >
              <div className="relative h-36 overflow-hidden transition duration-300 group-hover:opacity-95">
                <Image
                  src={getRestaurantImage(restaurante, 'banner')}
                  alt={`${restaurante.nome_restaurante} banner`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/90 shadow-sm transition duration-300 group-hover:scale-105">
                  <Image
                    src={getRestaurantImage(restaurante)}
                    alt={restaurante.nome_restaurante}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 transition group-hover:text-(--color-titulos)">
                      {restaurante.nome_restaurante}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {restaurante.categorias?.map((categoria) => categoria.nome_categoria).join(' • ') || 'Sem categoria cadastrada'}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {restaurante.enderecoPrincipal
                    ? `${restaurante.enderecoPrincipal.logradouro}, ${restaurante.enderecoPrincipal.numero} - ${restaurante.enderecoPrincipal.cidade}/${restaurante.enderecoPrincipal.estado}`
                    : 'Endereço não cadastrado'}
                </p>

                <p className="mt-2 text-sm text-gray-500">Horário: {restaurante.horario_atendimento}</p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-sm font-semibold text-white transition duration-300 group-hover:opacity-95">
                    Ver restaurante
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