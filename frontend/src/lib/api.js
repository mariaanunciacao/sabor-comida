const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002/api';

async function fetchJson(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        cache: 'no-store',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers ?? {}),
        },
    });

    if (!response.ok) {
        let errorMessage = `Falha ao buscar ${path}: ${response.status}`;

        try {
            const errorBody = await response.json();

            if (errorBody?.message) {
                errorMessage = errorBody.message;
            }
        } catch {
            // mantém a mensagem padrão quando o backend não devolver JSON
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function getRestaurants() {
    return fetchJson('/restaurantes');
}

export async function getCategories() {
    return fetchJson('/categorias');
}

export async function getRestaurantById(id) {
    return fetchJson(`/restaurantes/${id}`);
}

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

export async function getMyRestaurant(token) {
    return fetchJson('/restaurantes/meu', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function updateMyRestaurant(token, payload) {
    return fetchJson('/restaurantes/meu', {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function getAdminUsers(token) {
    return fetchJson('/admin/usuarios', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function getAdminProfiles(token) {
    return fetchJson('/admin/perfis', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createAdminProfile(token, payload) {
    return fetchJson('/admin/perfis', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function updateAdminProfile(token, profileId, payload) {
    return fetchJson(`/admin/perfis/${profileId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function getAdminDeliverers(token) {
    return fetchJson('/admin/entregadores', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createAdminDeliverer(token, payload) {
    return fetchJson('/admin/entregadores', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function updateAdminDeliverer(token, delivererId, payload) {
    return fetchJson(`/admin/entregadores/${delivererId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminDeliverer(token, delivererId) {
    return fetchJson(`/admin/entregadores/${delivererId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function getAdminRestaurants(token) {
    return fetchJson('/admin/restaurantes', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function getAdminCategories(token) {
    return fetchJson('/admin/categorias', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function createAdminCategory(token, payload) {
    return fetchJson('/admin/categorias', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function updateAdminCategory(token, categoryId, payload) {
    return fetchJson(`/admin/categorias/${categoryId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

export async function deleteAdminCategory(token, categoryId) {
    return fetchJson(`/admin/categorias/${categoryId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function updateAdminRestaurantStatus(token, restaurantId, statusAprovacao) {
    return fetchJson(`/admin/restaurantes/${restaurantId}/status`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status_aprovacao: statusAprovacao }),
    });
}

export async function updateAdminUserProfile(token, userId, idPerfil) {
    return fetchJson(`/admin/usuarios/${userId}/perfil`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idPerfil }),
    });
}

function pickFirstNonEmptyValue(...values) {
    return values.find((value) => typeof value === 'string' ? value.trim() !== '' : Boolean(value)) ?? null;
}

export function formatCurrency(value) {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numericValue);
    }

    return value ? String(value) : 'Sob consulta';
}

export function getRestaurantImage(restaurant, kind = 'logo') {
    if (kind === 'banner') {
        return pickFirstNonEmptyValue(restaurant.bannerUrl, restaurant.banner_path, restaurant.logoUrl, restaurant.logo_path) ?? '/banners/padaria-doce-pao.svg';
    }

    return pickFirstNonEmptyValue(restaurant.logoUrl, restaurant.logo_path, restaurant.bannerUrl, restaurant.banner_path) ?? '/logos/padaria-doce-pao.svg';
}

export function getRestaurantAddressLabel(restaurant) {
    const address = restaurant.enderecoPrincipal ?? restaurant.enderecos?.[0];

    if (!address) {
        return 'Endereço não cadastrado';
    }

    return `${address.logradouro}, ${address.numero} - ${address.cidade}/${address.estado}`;
}

export function getUniqueCategories(restaurants) {
    const categories = restaurants.flatMap((restaurant) => restaurant.categorias ?? []);

    return categories.reduce((accumulator, category) => {
        if (!accumulator.some((item) => item.id === category.id)) {
            accumulator.push(category);
        }

        return accumulator;
    }, []);
}

export function getFeaturedProducts(restaurants) {
    return restaurants
        .flatMap((restaurant) => {
            const imageSource = getRestaurantImage(restaurant, 'banner');

            return (restaurant.produtos ?? []).map((produto) => ({
                id: `${restaurant.id}-${produto.id}`,
                name: produto.nome_produto,
                place: restaurant.nome_restaurante,
                price: formatCurrency(produto.preco),
                image: imageSource,
                restaurantId: restaurant.id,
            }));
        })
        .sort((produtoA, produtoB) => Number(produtoA.id.split('-').pop()) - Number(produtoB.id.split('-').pop()));
}