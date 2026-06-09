import axios from "axios";
import { getSession } from "next-auth/react";
import { HTTP_BASE_URL } from "./config";

export const api = axios.create({
    baseURL: HTTP_BASE_URL
});

api.interceptors.request.use(async (config) => {
    if (typeof window !== "undefined") {
        const session = await getSession();
        if (session && session.jwt) {
            config.headers.Authorization = `Bearer ${session.jwt}`;
        }
    }
    return config;
});