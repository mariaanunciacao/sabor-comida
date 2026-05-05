import Link from "next/link";
import { MdAdminPanelSettings, MdLocalShipping, MdSecurity, MdStorefront } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";

const cards = [
  { title: 'Restaurantes', description: 'Aprove ou rejeite restaurantes cadastrados.', icon: MdStorefront, href: '/admin/restaurantes' },
  { title: 'Entregadores', description: 'Visualize entregadores vinculados ao sistema.', icon: MdLocalShipping, href: '/admin/entregadores' },
  { title: 'Categorias', description: 'Crie ou edite categorias.', icon: TbCategoryFilled, href: '/admin/categorias' },
  { title: 'Perfis', description: 'Crie ou edite perfis.', icon: MdSecurity, href: '/admin/perfis' },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Painel administrativo</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Administração central do Sabor Comida</h1>
          </div>

          
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link key={card.title} href={card.href} className="rounded-[1.5rem] border border-white/80 bg-white p-5 shadow-[0_14px_40px_rgba(249,115,22,0.10)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(249,115,22,0.16)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Icon className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}