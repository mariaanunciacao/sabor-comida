import Link from "next/link";
import { MdRestaurantMenu, MdCategory, MdOutlineFastfood } from "react-icons/md";

const cards = [
  { title: 'Menus', description: 'Agrupe os produtos em menus por momento ou tipo de serviço.', icon: MdRestaurantMenu },
  { title: 'Categorias', description: 'Organize o cardápio por família de produtos.', icon: MdCategory },
  { title: 'Produtos', description: 'Cadastre nome, descrição, preço e imagem.', icon: MdOutlineFastfood },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Cardápio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Monte a estrutura de venda do restaurante</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Esta tela vai servir para publicar menus, categorias e produtos. Sem isso o restaurante existe, mas ainda não vende nada.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Estrutura do cardápio</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {['Criar menu', 'Criar categoria', 'Adicionar produto', 'Subir imagem', 'Definir preço', 'Publicar'].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/restaurante/pedidos" className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Ir para pedidos
            </Link>
            <Link href="/restaurante" className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700">
              Voltar ao dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Próxima implementação</h2>
        </div>
      </section>
    </div>
  );
}