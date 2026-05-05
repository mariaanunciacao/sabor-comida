"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminDeliverer, deleteAdminDeliverer, getAdminDeliverers, updateAdminDeliverer } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";
import { MdDelete, MdEdit, MdOutlineAdd } from "react-icons/md";

const emptyForm = {
  nome: '',
  email: '',
  telefone: '',
  veiculo: '',
  regiao_atuacao: '',
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deliverers, setDeliverers] = useState([]);
  const [selectedDelivererId, setSelectedDelivererId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
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

  const selectedDeliverer = useMemo(
    () => deliverers.find((deliverer) => Number(deliverer.id) === Number(selectedDelivererId)) ?? null,
    [deliverers, selectedDelivererId],
  );

  function handleNew() {
    setSelectedDelivererId(null);
    setFormData(emptyForm);
    setMessage('');
  }

  function handleEdit(deliverer) {
    setSelectedDelivererId(deliverer.id);
    setFormData({
      nome: deliverer.nome ?? '',
      email: deliverer.email ?? '',
      telefone: deliverer.telefone ?? '',
      veiculo: deliverer.veiculo ?? '',
      regiao_atuacao: deliverer.regiao_atuacao ?? '',
    });
    setMessage('');
  }

  async function reloadDeliverers(sessionToken) {
    const data = await getAdminDeliverers(sessionToken);
    setDeliverers(data);
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
      if (selectedDelivererId) {
        const response = await updateAdminDeliverer(session.token, selectedDelivererId, formData);
        await reloadDeliverers(session.token);
        setMessage(response?.message ?? 'Entregador atualizado com sucesso.');
      } else {
        const response = await createAdminDeliverer(session.token, formData);
        await reloadDeliverers(session.token);
        setFormData(emptyForm);
        setMessage(response?.message ?? 'Entregador criado com sucesso.');
      }
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível salvar o entregador agora.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(delivererId) {
    const session = loadAuthSession();

    if (!session?.token) {
      router.replace('/login');
      return;
    }

    const confirmDelete = window.confirm('Tem certeza que deseja excluir este entregador?');

    if (!confirmDelete) {
      return;
    }

    setSaving(true);
    setMessage('');

    const previousDeliverers = deliverers;
    const wasSelected = Number(selectedDelivererId) === Number(delivererId);

    setDeliverers((current) => current.filter((deliverer) => Number(deliverer.id) !== Number(delivererId)));

    if (wasSelected) {
      handleNew();
    }

    try {
      await deleteAdminDeliverer(session.token, delivererId);
      await reloadDeliverers(session.token);
      setMessage('Entregador excluído com sucesso.');
    } catch (error) {
      setDeliverers(previousDeliverers);

      if (wasSelected) {
        const restoredDeliverer = previousDeliverers.find((deliverer) => Number(deliverer.id) === Number(delivererId));

        if (restoredDeliverer) {
          handleEdit(restoredDeliverer);
        }
      }

      setMessage(error?.message ?? 'Não foi possível excluir o entregador agora.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando entregadores...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-500 via-amber-400 to-amber-200 p-6 text-white shadow-[0_20px_60px_rgba(249,115,22,0.18)]">
        <p className="text-xs uppercase tracking-[0.24em] text-white/80">Admin / Entregadores</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Cadastro e edição de entregadores</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90">
          Cadastre nome, e-mail, telefone, veículo e região de atuação para controlar a operação de entregas pelo admin.
        </p>
      </div>

      {message ? <p className="text-sm text-amber-700">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              {selectedDeliverer ? <MdEdit className="size-6" /> : <MdOutlineAdd className="size-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {selectedDeliverer ? 'Editar entregador' : 'Novo entregador'}
              </h2>
              <p className="text-sm text-slate-600">{selectedDeliverer ? `Editando #${selectedDeliverer.id}` : 'Preencha os dados e salve o entregador.'}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Nome</label>
              <input
                value={formData.nome}
                onChange={(event) => setFormData((current) => ({ ...current, nome: event.target.value }))}
                placeholder="Ex.: João Silva"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">E-mail</label>
              <input
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="entregador@email.com"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Telefone</label>
              <input
                value={formData.telefone}
                onChange={(event) => setFormData((current) => ({ ...current, telefone: event.target.value }))}
                placeholder="(11) 99999-9999"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Veículo</label>
              <input
                value={formData.veiculo}
                onChange={(event) => setFormData((current) => ({ ...current, veiculo: event.target.value }))}
                placeholder="Moto, carro, bicicleta..."
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Região de atuação</label>
              <input
                value={formData.regiao_atuacao}
                onChange={(event) => setFormData((current) => ({ ...current, regiao_atuacao: event.target.value }))}
                placeholder="Zona Norte, Centro..."
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Salvando...' : selectedDeliverer ? 'Salvar alterações' : 'Criar entregador'}
            </button>

            <button
              type="button"
              onClick={handleNew}
              className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
            >
              Limpar formulário
            </button>
          </div>
        </form>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Entregadores cadastrados</h2>
              <p className="mt-1 text-sm text-slate-600">Clique em editar para ajustar os dados ou excluir para remover do banco.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {deliverers.map((deliverer) => (
              <article key={deliverer.id} className={`rounded-[1.5rem] border p-4 shadow-sm ${Number(selectedDelivererId) === Number(deliverer.id) ? 'border-orange-500 bg-orange-50/70' : 'border-orange-100 bg-orange-50/40'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Entregador #{deliverer.id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{deliverer.nome}</h3>
                    <p className="mt-1 text-sm text-slate-600">{deliverer.email}</p>
                    <p className="mt-1 text-sm text-slate-600">{deliverer.telefone}</p>
                    <p className="mt-1 text-sm text-slate-600">{deliverer.veiculo} · {deliverer.regiao_atuacao}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(deliverer)}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    <MdEdit />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(deliverer.id)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdDelete />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}