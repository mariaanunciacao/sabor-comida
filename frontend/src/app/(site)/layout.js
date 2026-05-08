import Link from "next/link";
import { IoSearchCircleOutline } from "react-icons/io5";
import AuthActions from "../../components/AuthActions";

export default function SiteLayout({ children }) {
  return (
    <>
      <nav className="w-full bg-(--color-fundo-nav) backdrop-blur-sm border-b rounded-none">
        <div className="mx-auto flex w-full max-w-none items-center gap-6 px-5 py-5">
          <div className="flex min-w-0 items-center gap-3 shrink-0">
            <span className="text-2xl shrink-0">🍔</span>
            <div className="min-w-0">
              <div className="text-(--color-titulos) font-semibold whitespace-nowrap">Sabor Comida</div>
              <div className="text-sm text-orange-400 italic whitespace-nowrap">O melhor lugar para matar sua fome</div>
            </div>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-10 md:flex">
            <Link href="/" className="whitespace-nowrap text-(--color-texto-nav) hover:text-(--color-texto-nav-hover)">Inicio</Link>
            <Link href="/restaurantes" className="whitespace-nowrap text-(--color-texto-nav) hover:text-(--color-texto-nav-hover)">Restaurantes</Link>
            <Link href="/mais-pedidos" className="whitespace-nowrap text-(--color-texto-nav) hover:text-(--color-texto-nav-hover)">Mais Pedidos</Link>
            <Link href="/meus-pedidos" className="whitespace-nowrap text-(--color-texto-nav) hover:text-(--color-texto-nav-hover)">Meus Pedidos</Link>

            <div className="relative w-[350px] shrink-0">
              <div
                data-combo-box='{
              "groupingType": "default",
              "isOpenOnFocus": true,
              "apiUrl": "/docs/json/searchbox.json",
              "apiGroupField": "position",
              "outputItemTemplate": "<div className=\"dropdown-item combo-box-selected:dropdown-active\" data-combo-box-output-item> <div className=\"flex items-center justify-between\"> <div className=\"flex items-center w-full\"> <div className=\"flex items-center justify-center rounded-full bg-base-200 size-6 overflow-hidden me-2.5\"> <img className=\"shrink-0\" data-combo-box-output-item-attr=&apos;[{\"valueFrom\": \"image\", \"attr\": \"src\"}, {\"valueFrom\": \"name\", \"attr\": \"alt\"}]&apos; /> </div> <div data-combo-box-output-item-field=\"name\" data-combo-box-search-text data-combo-box-value></div> </div> <span className=\"icon-[tabler--check] text-primary combo-box-selected:block hidden size-4 shrink-0\"> </span> </div> </div>","groupingTitleTemplate": "<div className=\"block text-xs text-base-content/50 m-3 mb-1\"></div>"
                }'
              >
                <div className="relative">
                  <IoSearchCircleOutline className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-(--color-botao-pesquisa)" />
                  <input
                    className="input w-full rounded-full border border-(--color-botao-pesquisa) ps-11 focus:border-(--color-botao-pesquisa) focus:outline-none focus:ring-0"
                    type="text"
                    placeholder="Pesquise por Produtos ou Restaurantes"
                    role="combobox"
                    aria-expanded="false"
                    aria-controls="searchbox-results"
                    defaultValue=""
                    autoFocus
                    data-combo-box-input=""
                  />
                </div>
                <div
                  id="searchbox-results"
                  className="bg-(--color-fundo-menu-mobile) rounded-box shadow-base-300/20 absolute z-50 max-h-56 w-full space-y-0.5 overflow-y-auto p-2 shadow-lg"
                  style={{ display: 'none' }}
                  data-combo-box-output=""
                ></div>
              </div>
            </div>
          </div>

          <AuthActions />
        </div>

        <div className="md:hidden" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-1 bg-(--color-fundo-menu-mobile)">
            <Link href="/" className="block py-2 text-(--color-texto-nav)">Inicio</Link>
            <Link href="/restaurantes" className="block py-2 text-(--color-texto-nav)">Restaurantes</Link>
            <Link href="/mais-pedidos" className="block py-2 text-(--color-texto-nav)">Mais Pedidos</Link>
            <Link href="/meus-pedidos" className="block py-2 text-(--color-texto-nav)">Meus Pedidos</Link>
            <a href="#" className="block py-2 text-(--color-texto-nav)">Pesquise por Produtos ou Restaurantes</a>
            <AuthActions mobile />
          </div>
        </div>
      </nav>

      {children}
    </>
  );
}