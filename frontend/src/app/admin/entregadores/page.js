"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminDeliverers } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deliverers, setDeliverers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
      return;
    }

    async function loadDeliverers() {
      try {
        const data = await getAdminDeliverers(session.token);
        setDeliverers(data);
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar os entregadores.');
      } finally {
        setLoading(false);
      }
    }

    loadDeliverers();
  }, [router]);

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando entregadores...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Admin / Entregadores</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Entregadores vinculados</h1>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-4">
        {deliverers.map((deliverer) => (
          <article key={deliverer.id} className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{deliverer.usuario?.nome ?? 'Entregador sem usuário'}</h2>
                <p className="text-sm text-slate-500">{deliverer.usuario?.email ?? 'Sem e-mail'}</p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">#{deliverer.id}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}