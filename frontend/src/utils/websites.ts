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