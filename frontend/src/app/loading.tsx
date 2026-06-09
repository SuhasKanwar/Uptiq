import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function LoadingPage() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-(--background-color) relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-color) opacity-10 blur-[100px] animate-pulse" />
            <div className="flex flex-col items-center gap-6 z-10">
                <Logo size="lg" />
                <Loader2 className="h-8 w-8 animate-spin text-(--primary-color)" />
            </div>
        </div>
    );
}