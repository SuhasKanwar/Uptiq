import { Globe, Plus } from "lucide-react";

interface EmptyStateProps {
    onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] py-24 text-center backdrop-blur-sm">
            <div className="mb-4 rounded-full bg-white/5 p-4 border border-white/10">
                <Globe className="h-8 w-8 text-(--secondary-color)" />
            </div>
            <h3 className="text-lg font-medium text-(--white-color)">No websites yet</h3>
            <p className="mt-2 max-w-sm text-sm text-(--secondary-color)">
                Get started by adding your first website to monitor its uptime and performance.
            </p>
            <button
                onClick={onAddClick}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-(--primary-color) transition hover:text-[#63e0c2]"
            >
                <Plus className="h-4 w-4" />
                Add your first website
            </button>
        </div>
    );
}