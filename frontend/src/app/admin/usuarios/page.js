"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminUsers } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
      return;
    }

    async function loadUsers() {
      try {
        const data = await getAdminUsers(session.token);
        setUsers(data);
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar os usuários.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [router]);

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando usuários...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Admin / Usuários</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Usuários do sistema</h1>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-4">
        {users.map((user) => (
          <article key={user.id} className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{user.nome}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">#{user.id}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(user.perfis ?? []).map((perfil) => (
                <span key={perfil.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {perfil.perfil}
                </span>
              ))}
            </div>

            {(user.restaurantes ?? []).length > 0 ? (
              <p className="mt-4 text-sm text-slate-600">
                Restaurante vinculado: {user.restaurantes[0].nome_restaurante} · CNPJ {user.restaurantes[0].cnpj}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}