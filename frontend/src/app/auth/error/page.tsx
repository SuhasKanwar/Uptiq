"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-(--background-color) px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 opacity-10 blur-[100px]" />

            <div className="mb-8">
                <Link href="/">
                    <Logo size="lg" />
                </Link>
            </div>

            <div className="relative w-full max-w-md text-center rounded-3xl border border-white/10 bg-[#0b1015]/80 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-(--white-color) mb-4">
                    Authentication Error
                </h2>

                <p className="text-base text-(--secondary-color) mb-8">
                    We encountered an issue while trying to authenticate you. Please ensure your credentials are correct or try again later.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/auth/signin"
                        className="group relative flex w-full justify-center rounded-xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-[#05110e] transition hover:bg-[#63e0c2]"
                    >
                        Try again
                    </Link>
                    <Link
                        href="/"
                        className="group relative flex w-full justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-(--white-color) transition hover:bg-white/10"
                    >
                        <span className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to home
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}