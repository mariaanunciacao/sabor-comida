"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, loadAuthSession } from "../../lib/session";
import { MdAdminPanelSettings, MdPeople, MdLocalShipping, MdSecurity, MdStorefront, MdLogout } from "react-icons/md";

const navigationItems = [
  { href: '/admin', label: 'Dashboard', icon: MdAdminPanelSettings },
  { href: '/admin/restaurantes', label: 'Restaurantes', icon: MdStorefront },
  { href: '/admin/usuarios', label: 'Usuários', icon: MdPeople },
  { href: '/admin/perfis', label: 'Perfis', icon: MdSecurity },
  { href: '/admin/entregadores', label: 'Entregadores', icon: MdLocalShipping },
];

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil !== 'admin') {
      router.replace('/login');
    }
  }, [router]);

  function handleLogout() {
    clearAuthSession();
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_30%),linear-gradient(180deg,_#fffaf5_0%,_#fff3e8_100%)] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_18px_50px_rgba(249,115,22,0.12)]">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-white/70">Painel administrativo</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sabor Comida</h1>
            <p className="mt-2 text-sm text-white/80">Área restrita para gestão de usuários, perfis e entregadores.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <MdLogout className="size-5" />
            Sair
          </button>
        </aside>

        <main className="rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-[0_18px_50px_rgba(249,115,22,0.10)] backdrop-blur-sm lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}