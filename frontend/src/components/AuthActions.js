"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlinePerson } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { clearAuthSession } from "../lib/session";

export default function AuthActions({ mobile = false }) {
  const router = useRouter();

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  if (mobile) {
    return (
      <div className="mt-2 flex items-center gap-3">
        <Link
          href="/login"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-(--color-botao-perfil) text-white shadow-sm hover:bg-(--color-botao-perfil-hover)"
          aria-label="Ir para login"
        >
          <MdOutlinePerson size={20} />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sair da conta"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-(--color-titulos) shadow-sm ring-1 ring-orange-100 transition hover:bg-orange-50"
        >
          <IoIosLogOut size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <Link
        href="/login"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-(--color-botao-perfil) text-white shadow-sm hover:bg-(--color-botao-perfil-hover)"
        aria-label="Ir para login"
      >
        <MdOutlinePerson size={20} />
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        aria-label="Sair da conta"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-(--color-titulos) shadow-sm ring-1 ring-orange-100 transition hover:bg-orange-50"
      >
        <IoIosLogOut size={20} />
      </button>
    </div>
  );
}