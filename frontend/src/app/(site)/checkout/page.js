"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import {
  getCart,
  formatCurrency,
  createOrder,
} from "../../../lib/api";

import { loadAuthSession } from "../../../lib/session";

const MapPicker = dynamic(
  () => import("../../../components/MapPicker"),
  { ssr: false }
);

export default function CheckoutPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [carrinho, setCarrinho] = useState({
    itens: [],
    total: 0,
  });

  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    estado: "",
    latitude: -26.4851,
    longitude: -49.0667,
  });

  const [formaPagamento, setFormaPagamento] =
    useState("pix");

  useEffect(() => {
    async function loadCheckout() {
      try {
        const session = loadAuthSession();

        const token =
          session?.token ??
          window.localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const data = await getCart(token);

        setCarrinho(
          data ?? {
            itens: [],
            total: 0,
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCheckout();
  }, [router]);

  async function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setEndereco((prev) => ({
        ...prev,
        cep: data.cep ?? "",
        logradouro: data.logradouro ?? "",
        cidade: data.localidade ?? "",
        estado: data.uf ?? "",
      }));
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar CEP.");
    }
  }

async function handleFinalizarPedido() {
  try {
    if (
      !endereco.cep ||
      !endereco.logradouro ||
      !endereco.numero ||
      !endereco.cidade ||
      !endereco.estado
    ) {
      alert("Preencha o endereço completo.");
      return;
    }

    const session = loadAuthSession();

    const token =
      session?.token ??
      window.localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    await createOrder(token, {
      endereco,
      formaPagamento,
    });

    alert("Pedido realizado com sucesso! 🎉");

    router.push("/");
  } catch (error) {
    console.error(error);

    alert(
      error.message ??
      "Erro ao finalizar pedido."
    );
  }
}

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <p>Carregando checkout...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-(--color-fundo-app) px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-(--color-titulos)">
            Checkout
          </h1>

          <p className="mt-1 text-gray-500">
            Revise seu pedido antes de finalizar.
          </p>
        </div>

        {/* ITENS */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Itens do Pedido
          </h2>

          <div className="space-y-4">
            {carrinho.itens.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {item.produto_carrinho?.nome_produto ??
                      "Produto"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantidade: {item.quantidade}
                  </p>
                </div>

                <div className="font-semibold">
                  {formatCurrency(
                    Number(item.valor_unitario) *
                      item.quantidade
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ENDEREÇO */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Endereço de Entrega
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="CEP"
              value={endereco.cep}
              onChange={(e) => {
                const value = e.target.value;

                setEndereco((prev) => ({
                  ...prev,
                  cep: value,
                }));

                buscarCEP(value);
              }}
              className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-orange-300"
            />

            <input
              type="text"
              placeholder="Logradouro"
              value={endereco.logradouro}
              onChange={(e) =>
                setEndereco((prev) => ({
                  ...prev,
                  logradouro: e.target.value,
                }))
              }
              className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-orange-300"
            />

            <input
              type="text"
              placeholder="Número"
              value={endereco.numero}
              onChange={(e) =>
                setEndereco((prev) => ({
                  ...prev,
                  numero: e.target.value,
                }))
              }
              className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-orange-300"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <input
                type="text"
                placeholder="Cidade"
                value={endereco.cidade}
                onChange={(e) =>
                  setEndereco((prev) => ({
                    ...prev,
                    cidade: e.target.value,
                  }))
                }
                className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-orange-300"
              />

              <input
                type="text"
                placeholder="Estado"
                value={endereco.estado}
                onChange={(e) =>
                  setEndereco((prev) => ({
                    ...prev,
                    estado: e.target.value,
                  }))
                }
                className="rounded-xl border p-3 outline-none focus:ring-2 focus:ring-orange-300"
              />

            </div>

            {/* MAPA */}
            <div className="mt-4">
              <MapPicker
                initialPosition={[
                  endereco.latitude,
                  endereco.longitude,
                ]}
                onChange={({
                  latitude,
                  longitude,
                }) => {
                  setEndereco((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                  }));
                }}
              />
            </div>

          </div>
        </section>

        {/* PAGAMENTO */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Forma de Pagamento
          </h2>

          <div className="flex flex-col gap-3">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="pix"
                checked={
                  formaPagamento === "pix"
                }
                onChange={(e) =>
                  setFormaPagamento(
                    e.target.value
                  )
                }
              />
              PIX
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="credito"
                checked={
                  formaPagamento === "credito"
                }
                onChange={(e) =>
                  setFormaPagamento(
                    e.target.value
                  )
                }
              />
              Cartão de Crédito
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="debito"
                checked={
                  formaPagamento === "debito"
                }
                onChange={(e) =>
                  setFormaPagamento(
                    e.target.value
                  )
                }
              />
              Cartão de Débito
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="dinheiro"
                checked={
                  formaPagamento === "dinheiro"
                }
                onChange={(e) =>
                  setFormaPagamento(
                    e.target.value
                  )
                }
              />
              Dinheiro
            </label>

          </div>
        </section>

        {/* TOTAL */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              {formatCurrency(carrinho.total)}
            </span>
          </div>
        </section>

        {/* BOTÕES */}
        <div className="flex gap-3">

          <button
            onClick={() =>
              router.push("/carrinho")
            }
            className="rounded-xl bg-gray-200 px-5 py-3 font-medium"
          >
            Voltar
          </button>

          <button
            onClick={handleFinalizarPedido}
            className="rounded-xl bg-(--color-botao-pedir-agora) px-5 py-3 font-semibold text-white"
          >
            Confirmar Pedido
          </button>

        </div>
      </div>
    </main>
  );
}