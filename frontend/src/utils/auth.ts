import { api } from "@/lib/api";

export async function login(credentials: Record<"username" | "password", string>) {
    try {
        const res = await api.post("/user/signin", {
            username: credentials.username,
            password: credentials.password,
        });

        if (res.data && res.data.jwt) {
            return {
                id: credentials.username,
                name: credentials.username,
                token: res.data.jwt,
            };
        }
        return null;
    } catch (error: any) {
        console.error("Login failed:", error?.response?.data || error.message);
        throw new Error(error?.response?.data || "Authentication failed");
    }
}

export async function signup(credentials: Record<"username" | "password", string>) {
    try {
        const res = await api.post("/user/signup", {
            username: credentials.username,
            password: credentials.password,
        });

        if (res.data && res.data.id) {
            return res.data;
        }
        return null;
    } catch (error: any) {
        console.error("Signup failed:", error?.response?.data || error.message);
        throw new Error(error?.response?.data || "Signup failed");
    }
}