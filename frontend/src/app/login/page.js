"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/api";
import { loadAuthSession, saveAuthSession } from "../../lib/session";

function redirectByProfile(router, session) {
  if (session.perfil === 'restaurante') {
    router.replace(`/restaurante?restaurantId=${session.id_restaurante}`);
    return;
  }

  if (session.perfil === 'admin') {
    router.replace('/admin');
    return;
  }

  router.replace('/');
}

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (!session?.perfil) {
      return;
    }

    redirectByProfile(router, session);
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await loginUser({ email, senha });

      saveAuthSession({
        token: response.token,
        perfil: response.perfil,
        perfis: response.perfis,
        id_restaurante: response.id_restaurante,
        usuario: response.usuario,
        restaurante: response.restaurante,
      });

      redirectByProfile(router, response);
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível autenticar agora.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-gradient-bg relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-white/18 blur-3xl" />
      <div className="pointer-events-none absolute right-[-7rem] top-1/4 h-80 w-80 rounded-full bg-[color:var(--color-fundo-login-dois)]/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] left-1/3 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-white/92 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-sm">
        <div className="space-y-6 p-8">
          <div className="space-y-2">
            <p className="text-3xl font-semibold tracking-tight text-(--color-titulos)">Entrar no Sabor Comida</p>
            <div className="text-sm text-gray-600">Use seu e-mail e senha para acessar a área correspondente ao seu perfil</div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">E-mail</p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu e-mail"
                className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Senha</p>
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
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
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
            </div>

            {message ? <p className="text-sm text-amber-700">{message}</p> : null}
          </form>

          <div className="flex flex-col items-center gap-3 text-sm">
            <span className="text-gray-500">Ainda não tem conta?</span>
            <Link href="/cadastro" title="Será enviado um e-mail para você" className="font-semibold text-(--color-titulos) hover:opacity-80">
              Criar conta de cliente
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}