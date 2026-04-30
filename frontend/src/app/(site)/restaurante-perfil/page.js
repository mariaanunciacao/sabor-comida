import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "../restaurants-data";

export default async function Page({ searchParams }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const restaurantSlug = resolvedSearchParams?.restaurant;
  const restaurant = restaurantSlug ? getRestaurantBySlug(restaurantSlug) : null;

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="bg-[color:var(--color-fundo-app)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-semibold text-(--color-titulos) hover:opacity-80">
            ← Voltar
          </Link>
          <Link href="/restaurantes" className="text-sm font-semibold text-gray-600 hover:text-(--color-titulos)">
            Ver mais restaurantes
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(245,128,103,0.18)]">
          <div className="relative h-56 sm:h-72">
            <Image
              src={restaurant.banner}
              alt={`${restaurant.name} banner`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />

            <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
              {restaurant.badge}
              <span className={`rounded-full px-2 py-0.5 ${restaurant.status === "Aberto" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {restaurant.status}
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-lg">
                  <Image src={restaurant.logo} alt={restaurant.name} width={80} height={80} className="h-full w-full object-cover" />
                </div>
                <div className="text-white">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/75">{restaurant.category}</p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{restaurant.name}</h1>
                  <p className="mt-1 max-w-2xl text-sm text-white/85">{restaurant.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-(--color-fundo-app) p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Endereço</p>
              <p className="mt-2 text-sm font-medium text-gray-800">{restaurant.address}</p>
            </div>
            <div className="rounded-2xl bg-(--color-fundo-app) p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Horário de Atendimento</p>
              <p className="mt-2 text-sm font-medium text-gray-800">{restaurant.hours}</p>
            </div>
            <div className="rounded-2xl bg-(--color-fundo-app) p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Categoria</p>
              <p className="mt-2 text-sm font-medium text-gray-800">{restaurant.category}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight text-(--color-titulos)">Sobre o restaurante</h2>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {restaurant.featured.map((item) => (
                <div key={item} className="rounded-2xl bg-(--color-fundo-app) px-4 py-3 text-sm font-medium text-gray-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
            <h2 className="text-2xl font-semibold tracking-tight text-(--color-titulos)">Menu</h2>
            <div className="mt-4 space-y-3">
              {restaurant.menu.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Disponível agora</p>
                  </div>
                  <span className="rounded-full bg-[color:var(--color-card-recomendado)]/20 px-3 py-1 text-sm font-semibold text-gray-900">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}