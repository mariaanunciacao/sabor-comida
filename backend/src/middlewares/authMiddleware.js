import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me';

function extractBearerToken(authorizationHeader) {
    if (!authorizationHeader) {
        return null;
    }

    const [type, token] = String(authorizationHeader).split(' ');

    if (type !== 'Bearer' || !token) {
        return null;
    }

    return token;
}

function getUserRoles(payload) {
    if (Array.isArray(payload?.perfis) && payload.perfis.length > 0) {
        return payload.perfis;
    }

    return payload?.perfil ? [payload.perfil] : [];
}

export function authenticateToken(req, res, next) {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).json({ message: 'Token não informado.' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.auth = payload;
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const roles = getUserRoles(req.auth);

        if (allowedRoles.length === 0 || roles.some((role) => allowedRoles.includes(role))) {
            return next();
        }

        return res.status(403).json({ message: 'Acesso negado para este perfil.' });
    };
}

export function authorizeRestaurantOwnership(req, res, next) {
    if (!req.auth) {
        return res.status(401).json({ message: 'Token não informado.' });
    }

    if (req.auth.perfil === 'admin') {
        return next();
    }

    if (req.auth.perfil !== 'restaurante' || !req.auth.id_restaurante) {
        return res.status(403).json({ message: 'Somente o restaurante responsável pode acessar este recurso.' });
    }

    const requestedRestaurantId = Number(req.params.restauranteId ?? req.params.id ?? req.query.restauranteId ?? req.body.restauranteId);

    if (Number.isInteger(requestedRestaurantId) && requestedRestaurantId !== Number(req.auth.id_restaurante)) {
        return res.status(403).json({ message: 'Você não pode acessar outro restaurante.' });
    }

    req.auth.id_restaurante = Number(req.auth.id_restaurante);
    return next();
}
