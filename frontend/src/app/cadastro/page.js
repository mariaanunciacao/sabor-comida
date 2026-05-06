"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";
import { clearAuthSession, loadAuthSession, saveAuthSession } from "../../lib/session";

export default function Page() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipo, setTipo] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successToken, setSuccessToken] = useState('');
  const [successEmail, setSuccessEmail] = useState('');

  useEffect(() => {
    const session = loadAuthSession();

    if (session?.perfil === 'cliente') {
      router.replace('/');
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccessToken('');
    setSuccessEmail('');

    if (senha !== confirmarSenha) {
      setMessage('As senhas não conferem.');
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({ nome, email, senha, tipo });

      clearAuthSession();
      saveAuthSession({
        token: response.token,
        tipo: response.tipo ?? response.perfil,
        perfil: response.perfil ?? response.tipo,
        perfis: response.perfis,
        id_restaurante: response.id_restaurante,
        usuario: response.usuario,
        restaurante: response.restaurante,
      });
      setSuccessToken(response.token);
      setSuccessEmail(response.usuario?.email ?? email);

      if ((response.tipo ?? response.perfil) === 'restaurante_pendente' || (response.tipo ?? response.perfil) === 'cliente') {
        router.push('/restaurante');
        return;
      }

      setMessage('Conta criada com sucesso. Agora faça login com o usuário recém-criado.');
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível criar sua conta agora.');
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
            <p className="text-3xl font-semibold tracking-tight text-(--color-titulos)">Crie sua conta</p>
            <div className="text-sm text-gray-600">Ao concluir, sua conta será salva na tabela de usuários e vinculada ao perfil cliente.</div>
          </div>

          {successToken ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <p className="text-lg font-semibold">Conta criada com sucesso</p>
                <p className="mt-1 text-sm leading-6">
                  Agora faça login com o e-mail {successEmail} para entrar no sistema por protocolo de segurança.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Token de confirmação</p>
                <p className="mt-2 break-all text-sm text-slate-700">{successToken}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95"
                >
                  Ir para o login
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessToken('');
                    setSuccessEmail('');
                    setMessage('');
                  }}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-50"
                >
                  Criar outra conta
                </button>
              </div>
            </div>
          ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Nome completo</p>
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Digite seu nome completo"
                className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

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
                placeholder="Crie uma senha"
                className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Repita a senha</p>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                placeholder="Repita sua senha"
                className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Tipo de cadastro</p>
              <select
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
                className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              >
                <option value="cliente">Cliente</option>
                <option value="restaurante_pendente">Restaurante</option>
              </select>
              <p className="text-xs text-gray-500">Restaurante inicia com cadastro pendente e depois envia os dados para análise.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'CRIANDO CONTA...' : 'CADASTRAR'}
            </button>

            {message ? <p className="text-sm text-amber-700">{message}</p> : null}
          </form>
          )}

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">Já possui conta?</span>
            <Link href="/login" className="font-semibold text-(--color-titulos) hover:opacity-80">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}