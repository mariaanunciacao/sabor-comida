import Link from "next/link";
import { MdDashboard, MdStorefront } from "react-icons/md";

const navigationItems = [
  { href: "/restaurante", label: "Dashboard", icon: MdDashboard },
  { href: "/restaurante/cadastro", label: "Cadastro", icon: MdStorefront },
];

export default function RestauranteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.14),_transparent_30%),linear-gradient(180deg,_#fffaf5_0%,_#fff3e8_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <aside className="flex flex-col rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_18px_50px_rgba(249,115,22,0.12)] backdrop-blur-sm">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-500 to-amber-400 p-5 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.24em] text-white/80">Painel do parceiro</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sabor Comida</h1>
            <p className="mt-2 text-sm text-white/85">Gerencie o cadastro do restaurante em um só lugar.</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-700 transition duration-300 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <Icon className="size-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[1.5rem] border border-orange-100 bg-orange-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Próximo passo</p>
            <p className="mt-1">Cadastrar os dados do restaurante e enviar para análise do administrador.</p>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(249,115,22,0.10)] backdrop-blur-sm lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}