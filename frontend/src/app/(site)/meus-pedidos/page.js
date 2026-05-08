"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  loadAuthSession,
} from "../../../lib/session";

import {
  getUserOrders,
  formatCurrency,
} from "../../../lib/api";

import {
  MdReceiptLong,
  MdDeliveryDining,
  MdDoneAll,
} from "react-icons/md";

const statusColors = {
  Recebido:
    "bg-blue-100 text-blue-700",

  Confirmado:
    "bg-cyan-100 text-cyan-700",

  "Em preparo":
    "bg-orange-100 text-orange-700",

  "Saiu para entrega":
    "bg-purple-100 text-purple-700",

  Entregue:
    "bg-green-100 text-green-700",

  Cancelado:
    "bg-red-100 text-red-700",
};

export default function Page() {
  const [pedidos, setPedidos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadPedidos() {
      try {
        const session =
          loadAuthSession();

        const token =
          session?.token ??
          window.localStorage.getItem(
            "token"
          );

        if (!token) return;

        const data =
          await getUserOrders(token);

        setPedidos(data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPedidos();
  }, []);

  return (
    <main className="min-h-screen bg-(--color-fundo-app) px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl space-y-6">

        {/* HEADER */}
        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <MdReceiptLong className="size-7" />
            </div>

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Histórico
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Meus Pedidos
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Acompanhe o andamento dos seus pedidos.
              </p>

            </div>

          </div>

        </section>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Carregando pedidos...
          </div>
        ) : pedidos.length === 0 ? (

          /* SEM PEDIDOS */
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <p className="text-lg font-semibold text-slate-700">
              Você ainda não realizou pedidos.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Quando fizer um pedido ele aparecerá aqui.
            </p>

          </div>

        ) : (

          /* LISTA */
          <div className="space-y-5">

            {pedidos.map((pedido) => (

              <div
                key={pedido.id}
                className="rounded-[2rem] border border-white bg-white p-6 shadow-sm"
              >

                {/* TOPO */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      Pedido #{pedido.id}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Restaurante:
                      {" "}
                      {
                        pedido.restaurantes
                          ?.nome_restaurante
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      Endereço:
                      {" "}
                      {
                        pedido.enderecos
                          ?.logradouro
                      }
                      ,
                      {" "}
                      {
                        pedido.enderecos
                          ?.numero
                      }
                    </p>

                  </div>

                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      statusColors[
                        pedido.status_pedido
                          ?.situacao
                      ] ??
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {
                      pedido.status_pedido
                        ?.situacao
                    }
                  </div>

                </div>

                {/* ENTREGADOR */}
                {pedido.entregadores && (

                  <div className="mt-5 rounded-2xl bg-purple-50 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <MdDeliveryDining className="size-6" />
                      </div>

                      <div>

                        <p className="font-semibold text-slate-800">
                          Entregador
                        </p>

                        <p className="text-sm text-slate-600">
                          {
                            pedido.entregadores
                              ?.nome
                          }
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* ITENS */}
                <div className="mt-6 border-t pt-5">

                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Itens do pedido
                  </h3>

                  <div className="space-y-3">

                    {pedido.itens_pedido?.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                        >

                          <div>

                            <p className="font-semibold text-slate-800">
                              {
                                item.produtos
                                  ?.nome_produto
                              }
                            </p>

                            <p className="text-sm text-slate-500">
                              Quantidade:
                              {" "}
                              {
                                item.quantidade
                              }
                            </p>

                          </div>

                          <div className="font-bold text-slate-700">

                            {formatCurrency(
                              Number(
                                item.valor_unitario
                              ) *
                                item.quantidade
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

                {/* TOTAL */}
                <div className="mt-6 flex items-center justify-between border-t pt-5">

                  <div className="flex items-center gap-2 text-slate-700">

                    <MdDoneAll className="size-5 text-green-600" />

                    <span className="font-medium">
                      Total do pedido
                    </span>

                  </div>

                  <div className="text-2xl font-bold text-slate-900">

                    {formatCurrency(
                      pedido.total ?? 0
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}