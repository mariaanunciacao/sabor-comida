"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminProfile, getAdminProfiles, updateAdminProfile } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";
import { MdEdit, MdOutlineAdd } from "react-icons/md";

const emptyForm = {
  nome: '',
  perfil: '',
};

const builtInAdminProfile = {
  id: 'admin',
  nome: 'Administrador',
  perfil: 'admin',
  fixed: true,
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
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

  const selectedProfile = useMemo(
    () => profiles.find((profile) => Number(profile.id) === Number(selectedProfileId)) ?? null,
    [profiles, selectedProfileId],
  );

  const visibleProfiles = useMemo(
    () => profiles.filter((profile) => String(profile.perfil).toLowerCase() !== 'admin'),
    [profiles],
  );

  function handleNewProfile() {
    setSelectedProfileId(null);
    setFormData(emptyForm);
    setMessage('');
  }

  function handleEditProfile(profile) {
    setSelectedProfileId(profile.id);
    setFormData({
      nome: profile.nome ?? '',
      perfil: profile.perfil ?? '',
    });
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const session = loadAuthSession();

    if (!session?.token) {
      router.replace('/login');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (!selectedProfileId && formData.perfil.trim().toLowerCase() === 'admin') {
        setMessage('O perfil admin é padrão do sistema e já vem criado.');
        return;
      }

      if (selectedProfileId) {
        const response = await updateAdminProfile(session.token, selectedProfileId, formData);
        setProfiles((current) => current.map((profile) => (Number(profile.id) === Number(selectedProfileId) ? response.perfil : profile)));
        setMessage('Perfil atualizado com sucesso.');
      } else {
        const response = await createAdminProfile(session.token, formData);
        setProfiles((current) => [response.perfil, ...current]);
        setFormData(emptyForm);
        setMessage('Perfil criado com sucesso.');
      }
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível salvar o perfil agora.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando perfis...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-500 via-amber-400 to-amber-200 p-6 text-white shadow-[0_20px_60px_rgba(249,115,22,0.18)]">
        <p className="text-xs uppercase tracking-[0.24em] text-white/80">Admin / Perfis</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Cadastro e edição de perfis</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90">
          Crie e ajuste os perfis usados pelo sistema, mantendo os identificadores coerentes com os fluxos de acesso.
        </p>
        <p className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
          O perfil admin já é padrão do sistema e não precisa ser criado.
        </p>
      </div>

      {message ? <p className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              {selectedProfile ? <MdEdit className="size-6" /> : <MdOutlineAdd className="size-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {selectedProfile ? 'Editar perfil' : 'Novo perfil'}
              </h2>
              <p className="text-sm text-slate-600">{selectedProfile ? `Editando #${selectedProfile.id}` : 'Preencha os dados e salve o perfil.'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nome do perfil</label>
              <input
                value={formData.nome}
                onChange={(event) => setFormData((current) => ({ ...current, nome: event.target.value }))}
                placeholder="Ex.: Administrador"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Identificador do perfil</label>
              <input
                value={formData.perfil}
                onChange={(event) => setFormData((current) => ({ ...current, perfil: event.target.value }))}
                placeholder="Ex.: admin"
                disabled={selectedProfile?.perfil === 'admin'}
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
              {selectedProfile?.perfil === 'admin' ? (
                <p className="mt-2 text-xs text-slate-500">O identificador do perfil admin é fixo.</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Salvando...' : selectedProfile ? 'Salvar alterações' : 'Criar perfil'}
            </button>

            <button
              type="button"
              onClick={handleNewProfile}
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              Limpar formulário
            </button>
          </div>
        </form>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Perfis cadastrados</h2>
              <p className="mt-1 text-sm text-slate-600">Clique em editar para ajustar o nome e o identificador.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <article className="rounded-[1.5rem] border border-orange-200 bg-orange-50/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Perfil padrão do sistema</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{builtInAdminProfile.nome}</h3>
                  <p className="mt-1 text-sm text-slate-600">{builtInAdminProfile.perfil}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">Fixo</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">Esse perfil já vem criado com o sistema e continua visível mesmo se a listagem da API falhar.</p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProfiles.map((profile) => (
                <article key={profile.id} className={`rounded-[1.5rem] border p-4 shadow-sm ${Number(selectedProfileId) === Number(profile.id) ? 'border-orange-500 bg-orange-50/70' : 'border-orange-100 bg-orange-50/40'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Perfil #{profile.id}</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{profile.nome}</h3>
                      <p className="mt-1 text-sm text-slate-600">{profile.perfil}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">{profile.perfil}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditProfile(profile)}
                      className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                    >
                      <MdEdit />
                      Editar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}