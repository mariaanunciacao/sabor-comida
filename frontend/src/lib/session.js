const AUTH_SESSION_KEY = 'sabor-comida:auth-session';

export function saveAuthSession(session) {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function loadAuthSession() {
    const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession);
    } catch {
        window.localStorage.removeItem(AUTH_SESSION_KEY);
        return null;
    }
}

export function clearAuthSession() {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
}
