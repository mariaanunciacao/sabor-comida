import Link from "next/link";
import Image from "next/image";
import { recomendados } from "./data";
import { restaurantes } from "./restaurants-data";

export default function Home() {
  const restaurantesEmAlta = restaurantes.map((restaurante) => ({
    slug: restaurante.slug,
    name: restaurante.name,
    image: restaurante.logo,
  }));

  const categorias = [
    { name: "Lanches", image: "https://blog.zanottirefrigeracao.com.br/wp-content/uploads/2017/09/lanche-na-chapa-1024x768.jpg" },
    { name: "Doces", image: "https://saborecia.com.br/wp-content/uploads/2020/08/MG_4421-scaled.jpg" },
    { name: "Marmitas", image: "https://controlenamao.com.br/blog/wp-content/uploads/2025/02/O-segredo-de-uma-marmitaria-de-sucesso_-uma-gestao-eficiente.webp" },
    { name: "Saudáveis", image: "https://blog.biglar.com.br/wp-content/uploads/2023/11/salad-from-tomatoes-cucumber-red-onions-lettuce-leaves-healthy-summer-vitamin-menu-vegan-vegetable-food-vegetarian-dinner-table.jpeg" },
    { name: "Japonesa", image: "https://djapa.com.br/wp-content/uploads/2024/03/comida-japonesa-para-iniciantes.jpg" },
    { name: "Pizzas", image: "https://images.aws.nestle.recipes/original/1821a30a8a8acec9f74a1372be582610_sem_t%C3%ADtulo_(18).jpg" },
    { name: "Padarias", image: "https://invexo.com.br/blog/wp-content/uploads/2022/10/paes-padarias-copacabana-rio-de-janeiro.jpg" },
    { name: "Carnes", image: "https://www.cutelariacimo.com.br/cdn/shop/articles/os-diversos-tipos-de-churrasco-pelo-mundo-descubra-tudo_520x500_e787e7fc-e352-4c7e-891c-c58811b817ee.jpg?v=1736876917" },
  ];

  return (
    <main className="flex-1 bg-(--color-fundo-app) flex items-start justify-stretch pt-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="px-5 py-4"></div>

        <div className="flex items-end justify-between gap-4 px-1">
          <h1 className="text-(--color-titulos) text-2xl font-semibold tracking-tight whitespace-nowrap">Restaurantes em Alta</h1>
        </div>
        <div className="px-4 py-3"></div>

        <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9">
          {restaurantesEmAlta.map((restaurante) => (
            <Link key={restaurante.name} href={`/restaurante-perfil?restaurant=${restaurante.slug}`} className="group relative flex flex-col items-center gap-3 rounded-3xl border border-white/70 bg-white/60 p-3 shadow-[0_10px_30px_rgba(249,115,22,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-borda-hover)] hover:shadow-[0_18px_36px_rgba(245,161,103,0.28)]">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[color:var(--color-card-recomendado)]/20 opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />
                <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-[color:var(--color-borda-hover)]/25 transition duration-300 group-hover:scale-105 group-hover:ring-[color:var(--color-borda-hover)]">
                  <Image
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    src={restaurante.image}
                    alt={restaurante.name}
                    width={96}
                    height={96}
                    unoptimized
                  />
                </div>
              </div>
              <span className="text-center text-xs font-semibold text-gray-700 transition group-hover:text-(--color-titulos)">
                {restaurante.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="px-5 py-4"></div>
        <div className="flex items-end justify-between gap-4 px-1">
          <h1 className="text-(--color-titulos) text-2xl font-semibold tracking-tight whitespace-nowrap">Categorias</h1>
        </div>
        <div className="px-4 py-3"></div>

        <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {categorias.map((categoria) => (
            <div key={categoria.name} className="group flex flex-col items-center gap-3 rounded-3xl border border-white/70 bg-white/70 p-3 shadow-[0_10px_30px_rgba(249,115,22,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-borda-hover)] hover:shadow-[0_18px_36px_rgba(245,161,103,0.22)]">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-orange-100/40 bg-white transition duration-300 group-hover:rounded-[1.15rem] group-hover:border-[color:var(--color-borda-hover)]/60">
                <Image
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  src={categoria.image}
                  alt={categoria.name}
                  width={96}
                  height={96}
                  unoptimized
                />
              </div>
              <p className="text-sm font-medium text-gray-700 transition group-hover:text-(--color-titulos)">{categoria.name}</p>
            </div>
          ))}
        </div>

        <div className="px-5 py-4"></div>
        <div className="flex items-end justify-between gap-4 px-1">
          <h1 className="text-(--color-titulos) text-2xl font-semibold tracking-tight whitespace-nowrap">Recomendados para você</h1>
        </div>
        <div className="px-4 py-3"></div>

        <div className="container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {recomendados.map((item) => (
            <article key={item.name} className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/85 shadow-[0_14px_40px_rgba(249,115,22,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(245,128,103,0.24)]">
              <div className="relative h-48 overflow-hidden">
                <Image
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700 shadow-sm">
                  Recomendado
                </div>
              </div>

              <div className="p-5">
                <h5 className="mb-1 text-lg font-bold text-gray-900 transition group-hover:text-(--color-titulos)">{item.name}</h5>
                <p className="mb-4 text-sm text-gray-500">{item.place}</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[color:var(--color-card-recomendado)]/25 px-3 py-1 text-sm font-semibold text-gray-900 ring-1 ring-[color:var(--color-card-recomendado)]/40">
                    {item.price}
                  </span>
                  <button className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--color-botao-pedir-agora)]/90 hover:shadow-md active:translate-y-0">
                    Pedir Agora
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}