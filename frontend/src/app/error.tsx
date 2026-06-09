"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import Logo from "@/components/Logo";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-(--background-color) px-4 py-12 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 opacity-10 blur-[100px]" />

            <div className="mb-8 relative z-10">
                <Link href="/">
                    <Logo size="lg" />
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-md text-center rounded-3xl border border-white/10 bg-[#0b1015]/80 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-(--white-color) mb-4">
                    Something went wrong!
                </h2>
                
                <p className="text-base text-(--secondary-color) mb-8">
                    An unexpected error occurred while rendering this page. We've been notified and are looking into it.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => reset()}
                        className="group relative flex w-full justify-center rounded-xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-[#05110e] transition hover:bg-[#63e0c2] focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:ring-offset-2 focus:ring-offset-(--background-color)"
                    >
                        <span className="flex items-center gap-2">
                            <RefreshCcw className="h-4 w-4" />
                            Try again
                        </span>
                    </button>
                    <Link
                        href="/"
                        className="group relative flex w-full justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-(--white-color) transition hover:bg-white/10"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}