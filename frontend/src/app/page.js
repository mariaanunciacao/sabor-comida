import { MdOutlinePerson } from "react-icons/md";
import { IoSearchCircleOutline } from "react-icons/io5";
export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 flex items-start justify-stretch pt-4">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        <nav className="w-full bg-white/80 backdrop-blur-sm border-b rounded-none">
          <div className="mx-auto flex w-full max-w-none items-center gap-6 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3 shrink-0">
              <span className="text-2xl shrink-0">🍔</span>
              <div className="min-w-0">
                <div className="text-(--color-titulos) font-semibold whitespace-nowrap">Sabor Comida</div>
                <div className="text-sm text-orange-400 italic whitespace-nowrap">O melhor lugar para matar sua fome</div>
              </div>
            </div>

            <div className="hidden flex-1 items-center justify-center gap-10 md:flex">
              <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-600">Inicio</a>
              <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-600">Restaurantes</a>
              <a href="#" className="whitespace-nowrap text-gray-700 hover:text-orange-600">Mais Pedidos</a>

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
                    <IoSearchCircleOutline className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-orange-500" />
                    <input
                      className="input w-full ps-11 border border-[var(--color-botao-pesquisa)] focus:border-[var(--color-botao-pesquisa)] focus:outline-none focus:ring-0"
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
                    className="bg-base-100 rounded-box shadow-base-300/20 absolute z-50 max-h-56 w-full space-y-0.5 overflow-y-auto p-2 shadow-lg"
                    style={{ display: 'none' }}
                    data-combo-box-output=""
                  ></div>
                </div>
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-3">
              <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-600 text-white shadow-sm hover:bg-orange-700">
                <MdOutlinePerson size={20} />
              </a>
            </div>
          </div>

          <div className="md:hidden" id="mobile-menu">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <a href="#" className="block py-2 text-gray-700">Inicio</a>
              <a href="#" className="block py-2 text-gray-700">Restaurantes</a>
              <a href="#" className="block py-2 text-gray-700">Mais Pedidos</a>
              <a href="#" className="block py-2 text-gray-700">Pesquise por Produtos ou Restaurantes</a>
              <a href="#" className="block mt-2 bg-orange-600 text-white px-3 py-2 rounded-md"><MdOutlinePerson /></a>
            </div>
          </div>
        </nav>

        <div className="px-5 py-4"></div>

        <div>
          <h1 className="text-(--color-titulos) font-semibold whitespace-nowrap">Restaurantes em Alta: </h1>
        </div>
        <div className="px-4 py-3"></div>

        {/* Restaurantes exibidos lado a lado */}
        <div className="card">
          <img className="px-3 py-3" src="https://images.vexels.com/media/users/3/215185/raw/9975fac6938d6d19c33105e44655a3c8-design-de-logotipo-do-restaurante-cheff.jpg" alt="Avatar"/>
          <div className="container">
          </div>
        </div>


      </div>
    </main>
  );
}