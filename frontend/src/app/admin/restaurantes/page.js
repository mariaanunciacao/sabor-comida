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

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [message, setMessage] = useState('');

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

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando restaurantes...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Admin / Restaurantes</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Aprovação de restaurantes</h1>
        <p className="mt-2 text-sm text-slate-600">Abaixo estão os restaurantes cadastrados. Use os botões para aprovar ou rejeitar cada um.</p>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-4">
        {restaurants.map((restaurant) => {
          const status = restaurant.status_aprovacao ?? 'pendente';

          return (
            <article key={restaurant.id} className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">{restaurant.nome_restaurante}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.pendente}`}>
                      {STATUS_LABELS[status] ?? 'Pendente'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">CNPJ {restaurant.cnpj}</p>
                  <p className="mt-1 text-sm text-slate-600">Responsável: {restaurant.usuario?.nome ?? 'sem usuário'} · {restaurant.usuario?.email ?? 'sem e-mail'}</p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">#{restaurant.id}</span>
              </div>

              <p className="mt-4 text-sm text-slate-600">{restaurant.descricao ?? 'Sem descrição cadastrada.'}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(restaurant.id, 'aprovado')}
                  disabled={savingId === restaurant.id}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingId === restaurant.id ? 'Salvando...' : 'Aprovar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(restaurant.id, 'rejeitado')}
                  disabled={savingId === restaurant.id}
                  className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Rejeitar
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(restaurant.id, 'pendente')}
                  disabled={savingId === restaurant.id}
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Voltar para pendente
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}