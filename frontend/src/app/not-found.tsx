import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import Logo from "@/components/Logo";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-(--background-color) px-4 py-12 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-color) opacity-10 blur-[100px]" />

            <div className="mb-8 relative z-10">
                <Link href="/">
                    <Logo size="lg" />
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-md text-center rounded-3xl border border-white/10 bg-[#0b1015]/80 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-(--primary-color)/10 border border-(--primary-color)/20 mb-6">
                    <SearchX className="h-8 w-8 text-(--primary-color)" />
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-(--white-color) mb-2">
                    404
                </h2>
                <h3 className="text-xl font-medium text-(--white-color) mb-4">
                    Page not found
                </h3>
                
                <p className="text-base text-(--secondary-color) mb-8">
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="group relative flex w-full justify-center rounded-xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-[#05110e] transition hover:bg-[#63e0c2] focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:ring-offset-2 focus:ring-offset-(--background-color)"
                >
                    <span className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to home
                    </span>
                </Link>
            </div>
        </div>
    );
}