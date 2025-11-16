import { useAuth } from "../context/AuthContext";

export function useApi() {
    const auth = useAuth();

    async function apiFetch(url: string, options: RequestInit = {}) {
        const headers = {
            ...options.headers,
            Authorization: auth.token ? `Bearer ${auth.token}` : "",
        };

        let res = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
        });

        if (res.status === 401) {
            const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            if (!refreshRes.ok) {
                auth.logout();
                return res;
            }

            const data = await refreshRes.json();
            auth.login(data.accessToken, data.username);

            // Rejouer la requête
            res = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${data.accessToken}`,
                },
                credentials: "include",
            });
        }

        return res;
    }

    return { apiFetch };
}
