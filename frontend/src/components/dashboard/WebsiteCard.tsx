import { useState } from "react";
import { Website } from "@/utils/websites";
import { Globe, Trash2, Edit2, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WebsiteCardProps {
    website: Website;
    onEditSave: (id: string, newUrl: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function WebsiteCard({ website, onEditSave, onDelete }: WebsiteCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editUrl, setEditUrl] = useState(website.url);
    const [isSubmitting, setIsSubmitting] = useState(false);

    let urlObj;
    try {
        urlObj = new URL(website.url);
    } catch (e) {
        urlObj = { hostname: website.url };
    }

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsSubmitting(true);
            await onEditSave(website.id, editUrl);
            setIsEditing(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(false);
        setEditUrl(website.url);
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await onDelete(website.id);
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-3 justify-between rounded-2xl border border-(--primary-color)/50 bg-[#0b1015]/80 p-6 shadow-lg backdrop-blur-md">
                <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-lg border border-(--primary-color)/50 bg-black/40 px-3 py-2 text-sm text-(--white-color) focus:outline-none"
                    autoFocus
                />
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="flex flex-1 items-center justify-center rounded-lg bg-(--primary-color) py-2 text-xs font-semibold text-[#05110e] transition hover:bg-[#63e0c2]"
                    >
                        {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="flex flex-1 items-center justify-center rounded-lg border border-white/20 bg-transparent py-2 text-xs font-medium text-(--white-color) transition hover:bg-white/10"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/dashboard/${website.id}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md transition hover:border-(--primary-color)/50 hover:bg-[#0b1015]/80 cursor-pointer block"
        >
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100 z-10">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    className="rounded-lg bg-white/10 p-2 text-(--secondary-color) transition hover:bg-white/20 hover:text-(--white-color)"
                    title="Edit"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
                <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="flex items-center gap-3 pr-16">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color) border border-(--primary-color)/20">
                    <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-medium text-(--white-color)">
                        {urlObj.hostname}
                    </h3>
                    <p className="truncate text-sm text-(--secondary-color) group-hover:text-(--primary-color) transition">
                        {website.url}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs font-medium text-(--secondary-color)">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--primary-color) opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-(--primary-color)"></span>
                    </span>
                    Monitoring Active
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">
                        {new Date(website.time_added * 1000).toLocaleDateString()}
                    </span>
                    <ArrowRight className="h-4 w-4 text-(--secondary-color) transition-transform group-hover:translate-x-1 group-hover:text-(--primary-color)" />
                </div>
            </div>
        </Link>
    );
}