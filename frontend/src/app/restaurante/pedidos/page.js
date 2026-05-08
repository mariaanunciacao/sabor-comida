"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  MdPendingActions,
  MdDoneAll,
  MdDeliveryDining,
} from "react-icons/md";

import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../../lib/api";

import {
  loadAuthSession,
} from "../../../lib/session";

const cards = [
  {
    title: "Recebidos",
    description:
      "Pedidos aguardando preparo.",
    icon: MdPendingActions,
  },

  {
    title: "Em preparo",
    description:
      "Pedidos sendo montados e conferidos.",
    icon: MdDoneAll,
  },

  {
    title: "Em rota",
    description:
      "Pedidos em caminho para o cliente.",
    icon: MdDeliveryDining,
  },
];

export default function Page() {
  const [pedidos, setPedidos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
        await getRestaurantOrders(
          token
        );

      setPedidos(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPedidos();
  }, []);

  async function handleStatus(
    pedidoId,
    status
  ) {
    try {
      const session =
        loadAuthSession();

      const token =
        session?.token ??
        window.localStorage.getItem(
          "token"
        );

      await updateOrderStatus(
        token,
        pedidoId,
        {
          status,
        }
      );

      await loadPedidos();
    } catch (error) {
      console.error(error);

      alert(
        error.message ??
          "Erro ao atualizar status."
      );
    }
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">

        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          Pedidos
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Acompanhe a operação do restaurante
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Gerencie os pedidos recebidos em tempo real.
        </p>

        {/* CARDS */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                  <Icon className="size-6" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {card.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="grid gap-6">

        {/* FILA */}
        <div className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/50 p-6">

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Fila operacional
          </h2>

          {/* LOADING */}
          {loading ? (
            <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
              Carregando pedidos...
            </div>
          ) : pedidos.length === 0 ? (

            /* SEM PEDIDOS */
            <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-600">
              Nenhum pedido encontrado.
            </div>

          ) : (

            /* PEDIDOS */
            <div className="mt-5 space-y-4">

              {pedidos.map((pedido) => (

                <div
                  key={pedido.id}
                  className="rounded-2xl border border-white bg-white p-5 shadow-sm"
                >

                  {/* TOPO */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>

                      <p className="text-lg font-semibold text-slate-800">
                        Pedido #{pedido.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Cliente:
                        {" "}
                        {pedido.pessoas?.usuario ??
                          pedido.pessoas?.nome ??
                          "Cliente"}
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

                      <p className="text-sm text-slate-500">
                        Cidade:
                        {" "}
                        {
                          pedido.enderecos
                            ?.cidade
                        }
                        /
                        {
                          pedido.enderecos
                            ?.estado
                        }
                      </p>

                      {pedido.entregadores && (
                        <p className="mt-2 text-sm font-medium text-orange-600">
                          Entregador:
                          {" "}
                          {
                            pedido.entregadores
                              ?.nome
                          }
                        </p>
                      )}

                    </div>

                    <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                      {
                        pedido.status_pedido
                          ?.situacao
                      }
                    </div>

                  </div>

                  {/* ITENS */}
                  <div className="mt-5 border-t pt-4">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Itens do pedido
                    </p>

                    <div className="space-y-2">

                      {pedido.itens_pedido?.map(
                        (item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                          >

                            <div>
                              <p className="font-medium text-slate-800">
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

                            <div className="font-semibold text-slate-700">
                              R$
                              {" "}
                              {Number(
                                item.valor_unitario
                              ).toFixed(2)}
                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* AÇÕES */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">

                    <button
                      onClick={() =>
                        handleStatus(
                          pedido.id,
                          "Confirmado"
                        )
                      }
                      className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Confirmar
                    </button>

                    <button
                      onClick={() =>
                        handleStatus(
                          pedido.id,
                          "Em preparo"
                        )
                      }
                      className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Em preparo
                    </button>

                    <button
                      onClick={() =>
                        handleStatus(
                          pedido.id,
                          "Saiu para entrega"
                        )
                      }
                      className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Saiu para entrega
                    </button>

                    <button
                      onClick={() =>
                        handleStatus(
                          pedido.id,
                          "Entregue"
                        )
                      }
                      className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Entregue
                    </button>

                    <button
                      onClick={() =>
                        handleStatus(
                          pedido.id,
                          "Cancelado"
                        )
                      }
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Cancelar
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* BOTÕES */}
          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              href="/restaurante/configuracoes"
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Configurações
            </Link>

            <Link
              href="/restaurante"
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700"
            >
              Voltar ao dashboard
            </Link>

          </div>

        </div>

      </section>
    </div>
  );
}