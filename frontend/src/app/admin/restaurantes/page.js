"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminRestaurants, updateAdminRestaurantStatus } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";

const STATUS_LABELS = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

const STATUS_STYLES = {
  pendente: 'bg-amber-100 text-amber-800',
  aprovado: 'bg-emerald-100 text-emerald-800',
  rejeitado: 'bg-rose-100 text-rose-800',
};

const REVIEW_FILTERS = [
  { value: 'aprovado', label: 'Aprovados' },
  { value: 'rejeitado', label: 'Reprovados' },
];

function getRestaurantStatus(restaurant) {
  return restaurant?.status_aprovacao ?? 'pendente';
}

function getRestaurantAddress(restaurant) {
  const parts = [restaurant?.logradouro, restaurant?.numero, restaurant?.cidade, restaurant?.estado]
    .filter((value) => String(value ?? '').trim() !== '');

  if (!parts.length) {
    return 'Endereço não informado.';
  }

  return parts.join(' · ');
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState('');
  const [reviewFilter, setReviewFilter] = useState('aprovado');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPendingRestaurantId, setSelectedPendingRestaurantId] = useState(null);

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
      return;
    }

    async function loadRestaurants() {
      try {
        const data = await getAdminRestaurants(session.token);
        setRestaurants(data);
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar os restaurantes.');
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, [router]);

  async function handleUpdateStatus(restaurantId, statusAprovacao) {
    const session = loadAuthSession();

    if (!session?.token) {
      router.replace('/login');
      return;
    }

    setSavingId(restaurantId);
    setMessage('');

    try {
      const response = await updateAdminRestaurantStatus(session.token, restaurantId, statusAprovacao);
      setRestaurants((current) => current.map((restaurant) => (
        Number(restaurant.id) === Number(restaurantId) ? response.restaurante : restaurant
      )));
      setMessage(`Restaurante ${STATUS_LABELS[statusAprovacao].toLowerCase()} com sucesso.`);
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível atualizar o status do restaurante.');
    } finally {
      setSavingId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const matchesSearch = (restaurant) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    return String(restaurant?.nome_restaurante ?? '').toLowerCase().includes(normalizedSearchTerm);
  };

  const pendingRestaurants = restaurants.filter((restaurant) => getRestaurantStatus(restaurant) === 'pendente' && matchesSearch(restaurant));
  const reviewedRestaurants = restaurants.filter((restaurant) => {
    const status = getRestaurantStatus(restaurant);
    return (status === 'aprovado' || status === 'rejeitado') && matchesSearch(restaurant);
  });
  const filteredReviewedRestaurants = reviewedRestaurants.filter((restaurant) => getRestaurantStatus(restaurant) === reviewFilter);
  const selectedPendingRestaurant = pendingRestaurants.find((restaurant) => Number(restaurant.id) === Number(selectedPendingRestaurantId)) ?? pendingRestaurants[0] ?? null;
  const activePendingRestaurantId = selectedPendingRestaurant?.id ?? null;

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando restaurantes...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Admin / Restaurantes</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Aprovação de restaurantes</h1>
            <p className="mt-2 text-sm text-slate-600">Abaixo estão os restaurantes cadastrados. Use os botões para aprovar ou rejeitar cada um.</p>
          </div>

          <div className="w-full max-w-sm rounded-[1.25rem] border border-orange-100 bg-white px-4 py-3 shadow-sm sm:w-auto">
            <label htmlFor="restaurant-search" className="block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Buscar restaurante
            </label>
            <input
              id="restaurant-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Digite o nome do restaurante"
              className="mt-2 w-full min-w-[240px] rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[color:var(--color-botao-pesquisa)] focus:bg-white focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
            />
          </div>
        </div>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Pendentes para análise</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Restaurantes aguardando resposta</h2>
              <p className="mt-2 text-sm text-slate-600">Clique em um restaurante para ver os dados enviados sem sair deste fluxo.</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{pendingRestaurants.length} pendentes</span>
          </div>

          <div className="mt-5 space-y-3">
            {pendingRestaurants.length ? pendingRestaurants.map((restaurant) => {
              const status = getRestaurantStatus(restaurant);
              const isSelected = Number(activePendingRestaurantId) === Number(restaurant.id);

              return (
                <button
                  key={restaurant.id}
                  type="button"
                  onClick={() => setSelectedPendingRestaurantId(restaurant.id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition ${isSelected ? 'border-orange-300 bg-orange-50 shadow-sm' : 'border-orange-100 bg-white hover:border-orange-200 hover:bg-orange-50/60'}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{restaurant.nome_restaurante}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.pendente}`}>
                          {STATUS_LABELS[status] ?? 'Pendente'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">CNPJ {restaurant.cnpj}</p>
                      <p className="mt-1 text-sm text-slate-600">{getRestaurantAddress(restaurant)}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">#{restaurant.id}</span>
                  </div>
                </button>
              );
            }) : (
              <div className="rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50/50 p-5 text-sm text-slate-600">
                Nenhum restaurante aguardando análise no momento.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">
          {selectedPendingRestaurant ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Visão rápida</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{selectedPendingRestaurant.nome_restaurante}</h2>
                  <p className="mt-2 text-sm text-slate-600">Confira os dados enviados antes de aprovar ou rejeitar.</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">#{selectedPendingRestaurant.id}</span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Responsável</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedPendingRestaurant.usuario?.nome ?? 'sem usuário'}</p>
                  <p className="mt-1 text-sm text-slate-600">{selectedPendingRestaurant.usuario?.email ?? 'sem e-mail'}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">CNPJ</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedPendingRestaurant.cnpj ?? 'Não informado'}</p>
                  <p className="mt-1 text-sm text-slate-600">Restaurante #{selectedPendingRestaurant.id}</p>
                </div>
                <div className="md:col-span-2 rounded-[1.5rem] border border-white bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Descrição</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{selectedPendingRestaurant.descricao ?? 'Sem descrição cadastrada.'}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedPendingRestaurant.id, 'aprovado')}
                  disabled={savingId === selectedPendingRestaurant.id}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingId === selectedPendingRestaurant.id ? 'Salvando...' : 'Aprovar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedPendingRestaurant.id, 'rejeitado')}
                  disabled={savingId === selectedPendingRestaurant.id}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Rejeitar
                </button>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center rounded-[1.5rem] border border-dashed border-orange-200 bg-white/80 p-6 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Visão rápida</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Nenhum restaurante pendente selecionado</h2>
                <p className="mt-2 text-sm text-slate-600">Quando houver pendentes, escolha um item da lista ao lado para abrir os detalhes aqui.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Restaurantes em análise</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Aprovados e reprovados</h2>
            <p className="mt-2 text-sm text-slate-600">Escolha o filtro para ver apenas os aprovados ou apenas os reprovados.</p>
          </div>

          <div className="inline-flex rounded-full border border-orange-100 bg-orange-50 p-1">
            {REVIEW_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setReviewFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${reviewFilter === filter.value ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          {filteredReviewedRestaurants.length ? filteredReviewedRestaurants.map((restaurant) => {
            const status = getRestaurantStatus(restaurant);

            return (
              <article key={restaurant.id} className="rounded-[1.5rem] border border-orange-100 bg-orange-50/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{restaurant.nome_restaurante}</h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.pendente}`}>
                        {STATUS_LABELS[status] ?? 'Pendente'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">CNPJ {restaurant.cnpj}</p>
                    <p className="mt-1 text-sm text-slate-600">Responsável: {restaurant.usuario?.nome ?? 'sem usuário'} · {restaurant.usuario?.email ?? 'sem e-mail'}</p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">#{restaurant.id}</span>
                </div>

                <p className="mt-4 text-sm text-slate-600">{restaurant.descricao ?? 'Sem descrição cadastrada.'}</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(restaurant.id, 'pendente')}
                    disabled={savingId === restaurant.id}
                    className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingId === restaurant.id ? 'Salvando...' : 'Voltar para pendente'}
                  </button>
                </div>
              </article>
            );
          }) : (
            <div className="rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50/40 p-5 text-sm text-slate-600">
              Nenhum restaurante {reviewFilter === 'aprovado' ? 'aprovado' : 'reprovado'} para exibir.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}