import Link from "next/link";
import { MdAdminPanelSettings, MdPeople, MdLocalShipping, MdSecurity } from "react-icons/md";

const cards = [
  { title: 'Usuários', description: 'Gerencie clientes, restaurantes e seus perfis.', icon: MdPeople },
  { title: 'Entregadores', description: 'Cadastre e atualize entregadores vinculados ao sistema.', icon: MdLocalShipping },
  { title: 'Segurança', description: 'Validações de acesso via JWT e RBAC no backend.', icon: MdSecurity },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,_#fffaf5_0%,_#fff3e8_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">Painel administrativo</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Administração central do Sabor Comida</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                Este espaço concentra o controle de usuários, perfis e entregadores. O backend valida permissões por JWT e middleware, então o acesso aqui não depende só do frontend.
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
                Depois a gente liga esta tela aos endpoints protegidos de usuários, perfis e entregadores.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-[1.5rem] border border-white/80 bg-white p-5 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Próximas telas</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Fluxo administrativo</h2>
            </div>
            <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Trocar usuário
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {['/admin/usuarios', '/admin/perfis', '/admin/entregadores', '/admin/relatorios'].map((item) => (
              <div key={item} className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-5 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}