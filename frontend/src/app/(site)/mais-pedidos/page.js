"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  addToCartCommerce,
  getFeaturedProducts,
  getRestaurants,
} from "../../../lib/api";

import { loadAuthSession } from "../../../lib/session";
import { useRouter } from 'next/navigation';

export default function Page() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const response = await getRestaurants();

        setRestaurantes(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAddToCart(product) {
    try {
      const session = loadAuthSession();

      if (!session?.token) {
        alert("Faça login para adicionar ao carrinho.");
        return;
      }

      const usuarioId = session?.usuario?.id;

      if (!usuarioId) {
        alert('Usuário não encontrado na sessão.');
        return;
      }

      await addToCartCommerce(session.token, usuarioId, product.restaurantId, product.id, 1);

      router.push('/carrinho');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const recomendados = getFeaturedProducts(restaurantes);

  const sections = [
    {
      title: "Número 1 em vendas",
      items: recomendados.slice(0, 4),
    },
    {
      title: "Desconto em até 50% off",
      items: recomendados.slice(4, 8),
    },
    {
      title: "Promoção de Dia das Mães",
      items: recomendados.slice(8, 12),
    },
  ].filter((section) => section.items.length > 0);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <p>Carregando produtos...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-(--color-fundo-app) flex items-start justify-stretch pt-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <section key={section.title} className="mb-12 last:mb-0">
            <div className="flex items-end justify-between gap-4 px-1">
              <h1 className="text-(--color-titulos) text-2xl font-semibold tracking-tight whitespace-nowrap">
                {section.title}
              </h1>
            </div>

            <div className="container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {section.items.map((item, idx) => (
                <article
                  key={`${item.restaurantId ?? 'r'}-${item.id ?? idx}`}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/85 shadow-[0_14px_40px_rgba(249,115,22,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(245,128,103,0.24)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    {(() => {
                      const imgSrc = item.image ?? item.imagem ?? item.foto ?? item.imagemUrl ?? item.imageUrl ?? '';
                      const safeSrc = imgSrc || '/images/default.png';
                      const safeAlt = item.name || item.titulo || item.title || 'Produto';

                      return (
                        <Image
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          src={safeSrc}
                          alt={safeAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          unoptimized
                        />
                      );
                    })()}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-700 shadow-sm">
                      Recomendado
                    </div>
                  </div>

                  <div className="p-5">
                    <h5 className="mb-1 text-lg font-bold text-gray-900 transition group-hover:text-(--color-titulos)">
                      {item.name}
                    </h5>

                    <p className="mb-4 text-sm text-gray-500">
                      {item.place}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[color:var(--color-card-recomendado)]/25 px-3 py-1 text-sm font-semibold text-gray-900 ring-1 ring-[color:var(--color-card-recomendado)]/40">
                        {item.price}
                      </span>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--color-botao-pedir-agora)]/90 hover:shadow-md active:translate-y-0"
                      >
                        Pedir Agora
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}