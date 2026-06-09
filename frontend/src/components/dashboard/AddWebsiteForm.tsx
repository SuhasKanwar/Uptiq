import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AddWebsiteFormProps {
    onAdd: (url: string) => Promise<void>;
    onCancel: () => void;
}

export default function AddWebsiteForm({ onAdd, onCancel }: AddWebsiteFormProps) {
    const [newUrl, setNewUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUrl) return;

        try {
            setIsSubmitting(true);
            let formattedUrl = newUrl;
            if (!/^https?:\/\//i.test(newUrl)) {
                formattedUrl = `https://${newUrl}`;
            }
            await onAdd(formattedUrl);
            setNewUrl("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#0b1015]/80 p-6 backdrop-blur-md shadow-xl transition-all">
            <h3 className="mb-4 text-lg font-medium text-(--white-color)">Monitor New Website</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-(--white-color) placeholder:text-white/20 focus:border-(--primary-color) focus:outline-none focus:ring-1 focus:ring-(--primary-color)"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 rounded-xl bg-(--white-color) px-5 py-2.5 text-sm font-semibold text-[#05110e] transition hover:bg-(--primary-color) disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-(--white-color) transition hover:bg-white/10"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}