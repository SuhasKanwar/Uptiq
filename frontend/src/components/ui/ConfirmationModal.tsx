import { Loader2, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
    isLoading = false,
    onConfirm,
    onCancel
}: ConfirmationModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-[#081015]/80 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onCancel : undefined}
            />
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-[#0b1015]/95 p-6 text-left shadow-2xl transition-all">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="absolute right-4 top-4 rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${isDestructive ? 'border-red-500/20 bg-red-500/10 text-red-500' : 'border-(--primary-color)/20 bg-(--primary-color)/10 text-(--primary-color)'}`}>
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">{title}</h3>
                        <p className="mt-2 text-sm text-white/60 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex min-w-[100px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${isDestructive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-(--primary-color) text-[#05110e] hover:bg-[#63e0c2]'}`}
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}