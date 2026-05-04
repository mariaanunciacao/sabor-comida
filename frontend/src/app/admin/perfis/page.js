"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminProfiles } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
      return;
    }

    async function loadProfiles() {
      try {
        const data = await getAdminProfiles(session.token);
        setProfiles(data);
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar os perfis.');
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [router]);

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando perfis...</div>;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Admin / Perfis</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Perfis do banco</h1>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => (
          <article key={profile.id} className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Perfil #{profile.id}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{profile.nome}</h2>
            <p className="mt-2 text-sm text-slate-600">{profile.perfil}</p>
          </article>
        ))}
      </div>
    </section>
  );
}