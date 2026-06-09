"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getWebsites, createWebsite, updateWebsite, deleteWebsite, Website } from "@/utils/websites";
import { Plus, Loader2 } from "lucide-react";
import WebsiteCard from "@/components/dashboard/WebsiteCard";
import AddWebsiteForm from "@/components/dashboard/AddWebsiteForm";
import EmptyState from "@/components/dashboard/EmptyState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function Dashboard() {
    const { data: session, status } = useSession({ required: true });
    
    const [websites, setWebsites] = useState<Website[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [isAdding, setIsAdding] = useState(false);
    
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        if (status === "authenticated") {
            fetchWebsites();
        }
    }, [status]);

    const fetchWebsites = async () => {
        try {
            setLoading(true);
            const data = await getWebsites();
            data.sort((a, b) => b.time_added - a.time_added);
            setWebsites(data);
            setError("");
        } catch (err: any) {
            setError(err.message || "Failed to load websites.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (url: string) => {
        try {
            await createWebsite(url);
            setIsAdding(false);
            await fetchWebsites();
        } catch (err: any) {
            setError(err.message || "Failed to add website.");
        }
    };


    const confirmDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await deleteWebsite(deletingId);
            setDeletingId(null);
            await fetchWebsites();
        } catch (err: any) {
            setError(err.message || "Failed to delete website.");
            setDeletingId(null);
        } finally {
            setIsDeleting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-(--background-color)">
                <Loader2 className="h-8 w-8 animate-spin text-(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-(--background-color) pb-24 pt-32 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-(--primary-color) opacity-5 blur-[120px]" />
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-(--white-color)">Dashboard</h1>
                        <p className="mt-2 text-sm text-(--secondary-color)">
                            Welcome back, {session?.user?.name}. Manage your monitored websites.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-(--primary-color) px-5 py-2.5 text-sm font-semibold text-[#05110e] transition hover:bg-[#63e0c2] shadow-[0_0_20px_rgba(65,209,170,0.2)]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Website
                    </button>
                </div>

                {error && (
                    <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {isAdding && (
                    <AddWebsiteForm 
                        onAdd={handleAdd} 
                        onCancel={() => setIsAdding(false)} 
                    />
                )}

                {websites.length === 0 && !isAdding ? (
                    <EmptyState onAddClick={() => setIsAdding(true)} />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {websites.map((website) => (
                            <WebsiteCard 
                                key={website.id}
                                website={website}
                                onDelete={confirmDelete}
                            />
                        ))}
                    </div>
                )}

                <ConfirmationModal 
                    isOpen={deletingId !== null}
                    title="Delete Website"
                    message="Are you sure you want to delete this monitored website? All associated telemetry data will be lost. This action cannot be undone."
                    confirmText="Delete Website"
                    isDestructive={true}
                    isLoading={isDeleting}
                    onConfirm={handleDelete}
                    onCancel={() => setDeletingId(null)}
                />
            </div>
        </div>
    );
}