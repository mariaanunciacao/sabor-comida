import Link from "next/link";
import { MdSettings, MdOutlinePayments, MdOutlineLocalOffer } from "react-icons/md";

const cards = [
  { title: 'Pagamento', description: 'Pix, cartão e dinheiro.', icon: MdOutlinePayments },
  { title: 'Promoções', description: 'Cupons e campanhas sazonais.', icon: MdOutlineLocalOffer },
  { title: 'Preferências', description: 'Status aberto/fechado e operação.', icon: MdSettings },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Configurações</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Ajustes finais do restaurante</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Esta tela fecha as configurações de operação, pagamento e promoções para o restaurante ficar pronto para vender.
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

      <section className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/50 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Configurações iniciais</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {['Formas de pagamento', 'Cupons', 'Taxa de entrega', 'Restaurante aberto/fechado', 'Tempo de preparo'].map((item) => (
            <div key={item} className="rounded-2xl border border-white bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/restaurante" className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            Voltar ao dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}