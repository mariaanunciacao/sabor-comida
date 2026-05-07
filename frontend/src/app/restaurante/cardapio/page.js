"use client";

import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getMyProducts,
  updateProduct,
} from "../../../lib/api";

import { loadAuthSession } from "../../../lib/session";

import {
  MdDelete,
  MdEdit,
  MdOutlineFastfood,
} from "react-icons/md";

const initialForm = {
  nome_produto: "",
  descricao: "",
  preco: "",
  ingredientes: "",
  imagem_path: "",
  idCategoria: "",
  ativo: true,
};

export default function Page() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);

      const session = loadAuthSession();

      if (!session?.token) {
        setLoading(false);
        return;
      }

      const response = await getMyProducts(session.token);

      setProducts(response);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        const session = loadAuthSession();

        if (!session?.token) return;

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            getMyProducts(session.token),
            getCategories(),
          ]);

        setProducts(productsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const session = loadAuthSession();

      if (!session?.token) return;

      const payload = {
        ...form,
        preco: Number(form.preco),
        idCategoria: Number(form.idCategoria),
      };

      console.log(payload);

      if (editingId) {
        await updateProduct(session.token, editingId, payload);
      } else {
        await createProduct(session.token, payload);
      }

      setForm(initialForm);
      setEditingId(null);

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      nome_produto: product.nome_produto,
      descricao: product.descricao,
      preco: product.preco,
      ingredientes: product.ingredientes,
      imagem_path: product.imagem_path ?? "",
      idCategoria: product.idCategoria ?? "",
      ativo: product.ativo,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(productId) {
    const confirmDelete = confirm(
      "Deseja realmente excluir este produto?"
    );

    if (!confirmDelete) return;

    try {
      const session = loadAuthSession();

      if (!session?.token) return;

      await deleteProduct(session.token, productId);

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          Cardápio
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Gerencie os produtos do restaurante
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Cadastre, edite e remova produtos do seu cardápio.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            name="nome_produto"
            placeholder="Nome do produto"
            value={form.nome_produto}
            onChange={handleChange}
            className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
            required
          />

          <input
            type="number"
            step="0.01"
            name="preco"
            placeholder="Preço"
            value={form.preco}
            onChange={handleChange}
            className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
            required
          />

          <select
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
            className="rounded-2xl border border-orange-200 px-4 py-3 outline-none"
            required
          >
            <option value="">
              Selecione uma categoria
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.nome_categoria}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleChange}
            />

            Produto ativo
          </label>

          <textarea
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            className="min-h-[120px] rounded-2xl border border-orange-200 px-4 py-3 outline-none md:col-span-2"
            required
          />

          <input
            type="text"
            name="ingredientes"
            placeholder="Ingredientes"
            value={form.ingredientes}
            onChange={handleChange}
            className="rounded-2xl border border-orange-200 px-4 py-3 outline-none md:col-span-2"
            required
          />

          <input
            type="text"
            name="imagem_path"
            placeholder="URL da imagem"
            value={form.imagem_path}
            onChange={handleChange}
            className="rounded-2xl border border-orange-200 px-4 py-3 outline-none md:col-span-2"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              {editingId
                ? "Atualizar produto"
                : "Cadastrar produto"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Produtos
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Produtos cadastrados
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <MdOutlineFastfood className="size-6" />
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-600">
            Carregando produtos...
          </p>
        ) : products.length === 0 ? (
          <p className="mt-6 text-sm text-slate-600">
            Nenhum produto cadastrado.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-[1.5rem] border border-orange-100 bg-orange-50/40 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {product.nome_produto}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      {product.descricao}
                    </p>

                    <p className="mt-3 text-sm text-slate-700">
                      <strong>Ingredientes:</strong>{" "}
                      {product.ingredientes}
                    </p>

                    <p className="mt-2 text-sm text-slate-700">
                      <strong>Categoria:</strong>{" "}
                      {product.categoria?.nome_categoria ??
                        "Sem categoria"}
                    </p>

                    <p className="mt-2 text-lg font-bold text-orange-600">
                      R$ {Number(product.preco).toFixed(2)}
                    </p>

                    <span
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.ativo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <MdEdit />
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      <MdDelete />
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}