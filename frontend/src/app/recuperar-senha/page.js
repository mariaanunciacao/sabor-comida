'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

export default function Page() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function solicitarCodigo(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/recuperar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? 'Não foi possível enviar o código.');
        return;
      }

      setMessage(data.message ?? 'Código enviado.');
      setStep('reset');
    } catch (error) {
      setMessage('Falha ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function redefinirSenha(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/redefinir-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, codigo, novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message ?? 'Não foi possível redefinir a senha.');
        return;
      }

      setMessage(data.message ?? 'Senha redefinida com sucesso.');
    } catch (error) {
      setMessage('Falha ao comunicar com o servidor.');
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
            <p className="text-3xl font-semibold tracking-tight text-(--color-titulos)">Recuperar acesso</p>
            <div className="text-sm text-gray-600">
              {step === 'request'
                ? 'Informe seu e-mail para receber o código de recuperação.'
                : 'Digite o código enviado e crie uma nova senha.'}
            </div>
          </div>

          {step === 'request' ? (
            <form className="space-y-4" onSubmit={solicitarCodigo}>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={redefinirSenha}>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">E-mail</p>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="input w-full rounded-2xl border border-orange-100 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Código de recuperação</p>
                <input
                  type="text"
                  value={codigo}
                  onChange={(event) => setCodigo(event.target.value)}
                  placeholder="Digite o código recebido"
                  className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Nova senha</p>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(event) => setNovaSenha(event.target.value)}
                  placeholder="Digite sua nova senha"
                  className="input w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-(--color-botao-pedir-agora) px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(245,128,103,0.28)] transition duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'SALVANDO...' : 'REDEFINIR SENHA'}
              </button>
            </form>
          )}

          {message ? <p className="text-sm font-medium text-gray-600">{message}</p> : null}

          <div className="flex justify-center text-sm">
            <Link href="/login" className="font-semibold text-(--color-titulos) hover:opacity-80">
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}