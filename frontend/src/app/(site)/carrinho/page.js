"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCart,
  removeCartItem,
  clearCart,
  formatCurrency,
} from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState({ itens: [], total: 0 });
  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const session = loadAuthSession();
      const token = session?.token ?? window.localStorage.getItem("token");

      if (!token) {
        router.push('/login');
        return;
      }

      const data = await getCart(token);
      setCarrinho(data ?? { itens: [], total: 0 });
    } catch (error) {
      console.error(error);
      setCarrinho({ itens: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRemove(itemId) {
    try {
      const session = loadAuthSession();
      const token = session?.token ?? window.localStorage.getItem("token");
      await removeCartItem(token, itemId);
      await load();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erro ao remover item.');
    }
  }

  async function handleClear() {
    try {
      const session = loadAuthSession();
      const token = session?.token ?? window.localStorage.getItem("token");
      await clearCart(token);
      await load();
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erro ao limpar carrinho.');
    }
  }

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <p>Carregando carrinho...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-(--color-fundo-app) px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Seu Carrinho</h1>

        {carrinho.itens.length === 0 ? (
          <div className="rounded-2xl bg-white/90 p-6 shadow-sm">Carrinho vazio</div>
        ) : (
          <div className="space-y-4">
            {carrinho.itens.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border bg-white p-4">
                <div>
                  <div className="font-medium">{item.produto_carrinho?.nome_produto ?? 'Produto'}</div>
                  <div className="text-sm text-gray-500">Qtd: {item.quantidade}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold">{formatCurrency(item.valor_unitario)}</div>
                  <button className="text-sm text-red-600" onClick={() => handleRemove(item.id)}>Remover</button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-2xl bg-white p-4">
              <div className="font-medium">Total</div>
              <div className="font-bold">{formatCurrency(carrinho.total)}</div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleClear} className="rounded-xl bg-gray-200 px-4 py-2">Limpar carrinho</button>
              <button
                onClick={() => router.push('/checkout')}
                className="rounded-xl bg-(--color-botao-pedir-agora) px-4 py-2 text-white"
              >
                Finalizar pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
