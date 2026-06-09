import { Website } from "@/utils/websites";
import { Globe, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WebsiteCardProps {
    website: Website;
    onDelete: (id: string) => void | Promise<void>;
}

export default function WebsiteCard({ website, onDelete }: WebsiteCardProps) {

    let urlObj;
    try {
        urlObj = new URL(website.url);
    } catch (e) {
        urlObj = { hostname: website.url };
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await onDelete(website.id);
    };

    return (
        <Link
            href={`/dashboard/${website.id}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md transition hover:border-(--primary-color)/50 hover:bg-[#0b1015]/80 cursor-pointer block"
        >
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition group-hover:opacity-100 z-10">
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