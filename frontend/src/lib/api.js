const API_URL =
  "http://localhost:3002/api";

/*
  FETCH BASE
*/

async function fetchJson(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type":
          "application/json",

        ...(options.headers || {}),
      },

      ...options,
    }
  );

  if (!response.ok) {
    let errorMessage = `Erro na requisição. (${response.status})`;

    try {
      const error = await response.json();
      // try to pick common fields
      errorMessage =
        error.message || error.error || error.msg || JSON.stringify(error) || errorMessage;
    } catch (err) {
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch {}
    }

    // log for debugging
    // eslint-disable-next-line no-console
    console.error('fetchJson error', { endpoint, status: response.status, message: errorMessage });

    throw new Error(errorMessage);
  }

  return response.json();
}

/*
  FORMATADOR
*/

export function formatCurrency(
  value
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  ).format(value ?? 0);
}

function normalizeToArray(value, fallbackKey) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (fallbackKey && Array.isArray(value[fallbackKey])) return value[fallbackKey];
  // try common keys
  for (const key of ["data", "items", "result", "categorias", "pedidos", "produtos", "restaurantes"]) {
    if (Array.isArray(value[key])) return value[key];
  }

  return [];
}

/*
  HOME
*/

export async function getCategories() {
  const res = await fetchJson("/categorias");
  return normalizeToArray(res, "categorias");
}

export function getFeaturedProducts(restaurantsOrParam) {
  // If caller passed an array of restaurants, build featured products from it
  if (Array.isArray(restaurantsOrParam)) {
    const restaurants = restaurantsOrParam;
    const products = restaurants.flatMap((r) => {
      const fromProdutos = Array.isArray(r.produtos) ? r.produtos : [];
      const fromMenus = (r.menus ?? []).flatMap((m) => Array.isArray(m.produtos) ? m.produtos : []);
      const all = [...fromProdutos, ...fromMenus].map((p) => ({ ...p, restaurantId: r.id }));
      return all;
    });

    return products;
  }
  // Otherwise fetch restaurants and derive products (returns a Promise)
  return fetchJson("/restaurantes").then((restaurantes) => {
    const list = normalizeToArray(restaurantes, "restaurantes");

    const produtos = list.flatMap((r) => {
      const fromProdutos = Array.isArray(r.produtos) ? r.produtos : [];
      const fromMenus = (r.menus ?? []).flatMap((m) => Array.isArray(m.produtos) ? m.produtos : []);
      return [...fromProdutos, ...fromMenus].map((p) => ({ ...p, restaurantId: r.id }));
    });

    return produtos;
  });
}

export async function getRestaurants() {
  const res = await fetchJson("/restaurantes");
  return normalizeToArray(res, "restaurantes");
}

export function getRestaurantImage(
  image
) {
  // Supports either passing the raw image path or a restaurant object.
  if (!image) return "/images/default.png";

  // If first arg is an object (restaurant), try to resolve banner/logo fields
  if (typeof image === "object") {
    const restaurant = image;
    const type = arguments[1] || null;

    const banner = restaurant.bannerUrl ?? restaurant.banner_path ?? restaurant.banner ?? null;
    const logo = restaurant.logoUrl ?? restaurant.logo_path ?? restaurant.logo ?? null;

    const chosen = type === "banner" ? banner : type === "logo" ? logo : banner ?? logo;

    if (!chosen) return "/images/default.png";

    return `${API_URL.replace(/\/api$/, "")}/uploads/${String(chosen).replace(/^\//, "")}`;
  }

  // otherwise assume string path
  return `${API_URL.replace(/\/api$/, "")}/uploads/${String(image).replace(/^\//, "")}`;
}

/*
  CARRINHO
*/

export async function getCart(
  token
) {
  return fetchJson("/carrinho", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addToCartCommerce(
  token,
  a,
  b,
  c,
  d
) {
  // Flexible signatures:
  // addToCartCommerce(token, payload)
  // addToCartCommerce(token, usuarioId, restauranteId, produtoId, quantidade)

  if (typeof a === "object") {
    // payload mode -> use auth protected endpoint
    return fetchJson("/carrinho/adicionar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(a),
    });
  }

  const usuarioId = a;
  const restauranteId = b;
  const produtoId = c;
  const quantidade = d ?? 1;

  // legacy commerce route expects usuarioId in path
  return fetchJson(`/usuarios/${usuarioId}/carrinho`, {
    method: "POST",
    body: JSON.stringify({ restauranteId, produtoId, quantidade }),
  });
}

export async function removeCartItem(token, itemId) {
  return fetchJson(`/carrinho/item/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearCart(token) {
  return fetchJson("/carrinho/limpar", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/*
  PEDIDOS
*/

export async function createOrder(
  token,
  payload
) {
  return fetchJson("/pedidos", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(payload),
  });
}

export async function getRestaurantOrders(
  token
) {
  return fetchJson(
    "/restaurante/pedidos",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function updateOrderStatus(
  token,
  pedidoId,
) {
  // Allow calling with numeric id or with { status: 'Em preparo' }
  const third = arguments[2];

  // If caller provided a string-based status, map to numeric id
  if (third && typeof third === "object" && typeof third.status === "string") {
    const status = String(third.status).toLowerCase();

    const map = {
      recebido: 1,
      novo: 1,
      confirmado: 2,
      "em preparo": 3,
      preparo: 3,
      "saiu para entrega": 4,
      entrega: 4,
      entregue: 5,
      cancelado: 6,
    };

    const idStatus = map[status] ?? null;

    if (idStatus == null) {
      // fallback: try to send raw string as idStatusPedido (will likely fail server-side)
      return fetchJson(`/pedidos/${pedidoId}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idStatusPedido: third.status }),
      });
    }

    // For restaurant UI use restaurant-specific endpoint
    return fetchJson(`/restaurantes/meu/pedidos/${pedidoId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ idStatus }),
    });
  }

  // numeric id path (cliente/admin)
  const idStatusPedido = third;

  return fetchJson(`/pedidos/${pedidoId}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ idStatusPedido }),
  });
}

export async function getMyOrders(
  token
) {
  return fetchJson(
    "/meus-pedidos",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// Backwards-compat alias: some screens import getUserOrders
export const getUserOrders = async (token) => {
  const res = await getMyOrders(token);
  // some legacy endpoints return { pedidos: [...] }
  if (res && Array.isArray(res)) return res;
  if (res && Array.isArray(res.pedidos)) return res.pedidos;
  return res ?? [];
};

export async function getRestaurantById(id) {
  return fetchJson(`/restaurantes/${id}`);
}

export function getRestaurantAddressLabel(restaurant) {
  const end = restaurant?.enderecoPrincipal ?? restaurant?.endereco ?? restaurant?.enderecoPrincipal ?? null;

  if (!end) return "Endereço não cadastrado";

  const log = end.logradouro ?? end.rua ?? end.address ?? "";
  const num = end.numero ?? end.number ?? "";
  const city = end.cidade ?? end.city ?? "";
  const state = end.estado ?? end.state ?? "";

  return `${log}${num ? `, ${num}` : ""}${city ? ` - ${city}` : ""}${state ? `/${state}` : ""}`;
}

/*
  AUTH
*/

export async function loginUser(payload) {
  return fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload) {
  return fetchJson('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/*
  RESTAURANTE (me)
*/

export async function getMyRestaurant(token) {
  return fetchJson('/restaurantes/meu', { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateMyRestaurant(token, payload) {
  return fetchJson('/restaurantes/meu', { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

/*
  RESTAURANTE - PRODUTOS (meu)
*/

export async function getMyProducts(token) {
  return fetchJson('/restaurantes/meu/produtos', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createProduct(token, payload) {
  return fetchJson('/restaurantes/meu/produtos', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function updateProduct(token, id, payload) {
  return fetchJson(`/restaurantes/meu/produtos/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function deleteProduct(token, id) {
  return fetchJson(`/restaurantes/meu/produtos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}

/*
  ADMIN
*/

export async function getAdminProfiles(token) {
  return fetchJson('/admin/perfis', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createAdminProfile(token, payload) {
  return fetchJson('/admin/perfis', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function updateAdminProfile(token, id, payload) {
  return fetchJson(`/admin/perfis/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function getAdminDeliverers(token) {
  return fetchJson('/admin/entregadores', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createAdminDeliverer(token, payload) {
  return fetchJson('/admin/entregadores', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function updateAdminDeliverer(token, id, payload) {
  return fetchJson(`/admin/entregadores/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function deleteAdminDeliverer(token, id) {
  return fetchJson(`/admin/entregadores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminCategories(token) {
  return fetchJson('/admin/categorias', { headers: { Authorization: `Bearer ${token}` } });
}

export async function createAdminCategory(token, payload) {
  return fetchJson('/admin/categorias', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function updateAdminCategory(token, id, payload) {
  return fetchJson(`/admin/categorias/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}

export async function deleteAdminCategory(token, id) {
  return fetchJson(`/admin/categorias/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}

export async function getAdminRestaurants(token) {
  return fetchJson('/admin/restaurantes', { headers: { Authorization: `Bearer ${token}` } });
}

export async function updateAdminRestaurantStatus(token, id, payload) {
  return fetchJson(`/admin/restaurantes/${id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
}