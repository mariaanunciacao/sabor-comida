"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminCategory, deleteAdminCategory, getAdminCategories, updateAdminCategory } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";
import { TbCategoryFilled } from "react-icons/tb";
import { MdDelete, MdEdit, MdOutlineAddPhotoAlternate } from "react-icons/md";

const emptyForm = {
  nome_categoria: '',
  imagem_path: '',
};

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
      return;
    }

    async function loadCategories() {
      try {
        const data = await getAdminCategories(session.token);
        setCategories(data);
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar as categorias.');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [router]);

  const selectedCategory = useMemo(
    () => categories.find((category) => Number(category.id) === Number(selectedCategoryId)) ?? null,
    [categories, selectedCategoryId],
  );

  function handleEdit(category) {
    setSelectedCategoryId(category.id);
    setFormData({
      nome_categoria: category.nome_categoria ?? '',
      imagem_path: category.imagem_path ?? '',
    });
    setMessage('');
  }

  function handleNew() {
    setSelectedCategoryId(null);
    setFormData(emptyForm);
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
      if (selectedCategoryId) {
        const response = await updateAdminCategory(session.token, selectedCategoryId, formData);
        const updatedCategories = await getAdminCategories(session.token);
        setCategories(updatedCategories);
        setMessage(response?.message ?? 'Categoria atualizada com sucesso.');
      } else {
        const response = await createAdminCategory(session.token, formData);
        const updatedCategories = await getAdminCategories(session.token);
        setCategories(updatedCategories);
        setFormData(emptyForm);
        setMessage(response?.message ?? 'Categoria criada com sucesso.');
      }
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível salvar a categoria agora.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(categoryId) {
    const session = loadAuthSession();

    if (!session?.token) {
      router.replace('/login');
      return;
    }

    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta categoria?');

    if (!confirmDelete) {
      return;
    }

    setSaving(true);
    setMessage('');

    const previousCategories = categories;
    const categoryWasSelected = Number(selectedCategoryId) === Number(categoryId);

    setCategories((current) => current.filter((category) => Number(category.id) !== Number(categoryId)));

    if (categoryWasSelected) {
      handleNew();
    }

    try {
      await deleteAdminCategory(session.token, categoryId);

      const updatedCategories = await getAdminCategories(session.token);
      setCategories(updatedCategories);

      setMessage('Categoria excluída com sucesso.');
    } catch (error) {
      setCategories(previousCategories);

      if (categoryWasSelected) {
        const restoredCategory = previousCategories.find((category) => Number(category.id) === Number(categoryId));

        if (restoredCategory) {
          handleEdit(restoredCategory);
        }
      }

      setMessage(error?.message ?? 'Não foi possível excluir a categoria agora.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600">Carregando categorias...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-500 via-amber-400 to-amber-200 p-6 text-white shadow-[0_20px_60px_rgba(249,115,22,0.18)]">
        <p className="text-xs uppercase tracking-[0.24em] text-white/80">Admin / Categorias</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Cadastro e edição de categorias</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/90">
          Use esta tela para criar novas categorias e ajustar as existentes que alimentam a busca e os restaurantes.
        </p>
      </div>

      {message ? <p className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{message}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <TbCategoryFilled className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {selectedCategory ? 'Editar categoria' : 'Nova categoria'}
              </h2>
              <p className="text-sm text-slate-600">{selectedCategory ? `Editando #${selectedCategory.id}` : 'Preencha os dados e salve a categoria.'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nome da categoria</label>
              <input
                value={formData.nome_categoria}
                onChange={(event) => setFormData((current) => ({ ...current, nome_categoria: event.target.value }))}
                placeholder="Ex.: Lanches"
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Imagem da categoria</label>
              <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/40 px-4 py-3">
                <MdOutlineAddPhotoAlternate className="size-5 text-orange-600" />
                <input
                  value={formData.imagem_path}
                  onChange={(event) => setFormData((current) => ({ ...current, imagem_path: event.target.value }))}
                  placeholder="/categorias/lanches.png"
                  className="w-full bg-transparent text-gray-700 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Salvando...' : selectedCategory ? 'Salvar alterações' : 'Criar categoria'}
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
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Categorias cadastradas</h2>
              <p className="mt-1 text-sm text-slate-600">Clique em editar para ajustar um item existente.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <article key={category.id} className={`rounded-[1.5rem] border p-4 shadow-sm ${Number(selectedCategoryId) === Number(category.id) ? 'border-orange-500 bg-orange-50/70' : 'border-orange-100 bg-orange-50/40'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Categoria #{category.id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{category.nome_categoria}</h3>
                    <p className="mt-1 text-sm text-slate-600">{category.imagem_path || 'Sem imagem cadastrada'}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">{category.imagem_path ? 'Com imagem' : 'Sem imagem'}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    <MdEdit />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
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