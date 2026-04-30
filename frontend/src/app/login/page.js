import Link from "next/link";
export default function Page() {
  return (
    <main className="login-gradient-bg relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-white/18 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-1/4 h-80 w-80 rounded-full bg-[color:var(--color-fundo-login-dois)]/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-white/92 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm">

        <div className="space-y-6 p-8">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight text-(--color-titulos)">Faça Login</p>
            <div className="text-sm text-gray-600">Entre com sua conta para continuar no Sabor Comida</div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">E-mail</p>
            <input
              type="text"
              placeholder="Digite seu e-mail"
              className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Senha</p>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">Esqueceu sua senha?</span>
            <Link href="/recuperar-senha" title="Será enviado um e-mail para você" className="font-semibold text-(--color-titulos) hover:opacity-80">
              Recuperar acesso
            </Link>
          </div>

          <div>
            <button
              type="button"
              className="w-full rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95"
            >
              LOGIN
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 text-sm">
            <span className="text-gray-500">Não possui conta?</span>
            <Link href="/cadastro" title="Será enviado um e-mail para você" className="font-semibold text-(--color-titulos) hover:opacity-80">
              Crie sua conta gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}