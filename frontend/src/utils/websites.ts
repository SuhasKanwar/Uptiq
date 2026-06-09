import { api } from "@/lib/api";

export type Website = {
    id: string;
    url: string;
    user_id: string;
    time_added: number;
};

export async function getWebsites(): Promise<Website[]> {
    const res = await api.get("/websites");
    return res.data.websites || [];
}

export async function getWebsite(id: string): Promise<Website> {
    const res = await api.get(`/websites/${id}`);
    return res.data.website;
}

export async function createWebsite(url: string): Promise<{ id: string }> {
    const res = await api.post("/websites", { url });
    return res.data;
}

export async function updateWebsite(id: string, url: string): Promise<Website> {
    const res = await api.put(`/websites/${id}`, { url });
    return res.data.website;
}

export async function deleteWebsite(id: string): Promise<void> {
    await api.delete(`/websites/${id}`);
}

export type WebsiteTick = {
    id: string;
    response_time_ms: number;
    status: string; // "Up", "Down", "Unknown"
    created_at: number; // Unix timestamp
};

export async function getWebsiteTicks(id: string): Promise<WebsiteTick[]> {
    const res = await api.get(`/websites/${id}/ticks`);
    return res.data.ticks || [];
}