import Link from "next/link";
import { MdAdminPanelSettings, MdPeople, MdLocalShipping, MdSecurity, MdStorefront } from "react-icons/md";

const cards = [
  { title: 'Restaurantes', description: 'Aprove ou rejeite restaurantes cadastrados.', icon: MdStorefront, href: '/admin/restaurantes' },
  { title: 'Usuários', description: 'Gerencie clientes, restaurantes e seus perfis.', icon: MdPeople, href: '/admin/usuarios' },
  { title: 'Entregadores', description: 'Visualize entregadores vinculados ao sistema.', icon: MdLocalShipping, href: '/admin/entregadores' },
  { title: 'Segurança', description: 'JWT, perfis e regras de acesso vêm do banco.', icon: MdSecurity, href: '/admin/perfis' },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Painel administrativo</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Administração central do Sabor Comida</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
              Este espaço concentra o controle de usuários, perfis e entregadores. O acesso é liberado quando o JWT do login contém o perfil admin vindo do banco.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900">
                <MdAdminPanelSettings className="size-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Acesso</p>
                <p className="text-lg font-semibold">Somente perfil admin</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/80">
              O backend protege os endpoints e a tela também verifica a sessão local para manter a área específica do admin.
            </p>
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

      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Fluxo administrativo</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Telas principais do admin</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {['/admin', '/admin/restaurantes', '/admin/usuarios', '/admin/perfis', '/admin/entregadores'].map((item) => (
            <Link key={item} href={item} className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-5 text-sm font-medium text-slate-700 transition hover:bg-orange-50">
              {item}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}