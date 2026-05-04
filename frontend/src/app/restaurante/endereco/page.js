import Link from "next/link";
import { MdOutlinePlace, MdOutlineMap, MdOutlineLocationOn } from "react-icons/md";

const cards = [
  { title: 'Logradouro', description: 'Rua, avenida ou estrada onde o restaurante está localizado.', icon: MdOutlinePlace },
  { title: 'Número e CEP', description: 'Dados que identificam o ponto físico e facilitam entrega.', icon: MdOutlineMap },
  { title: 'Cidade e estado', description: 'Localização administrativa exibida para o cliente.', icon: MdOutlineLocationOn },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Endereço do restaurante</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Cadastre a localização principal</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          O endereço entra na vitrine e também serve para entender área de atendimento e logística.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Campos do endereço</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {['Logradouro', 'Número', 'CEP', 'Cidade', 'Estado'].map((item) => (
              <div key={item} className="rounded-2xl border border-white bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/restaurante/cardapio" className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Ir para cardápio
            </Link>
            <Link href="/restaurante" className="rounded-full border border-orange-200 bg-white px-5 py-3 text-sm font-semibold text-orange-700">
              Voltar ao dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Objetivo da tela</h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Depois que o endereço estiver salvo, o restaurante já pode aparecer corretamente na busca e na página de perfil.
          </p>
        </div>
      </section>
    </div>
  );
}