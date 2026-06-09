"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                username,
                password,
                callbackUrl,
            });

            if (!res?.error) {
                router.push(callbackUrl);
                router.refresh();
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-(--background-color) px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-color) opacity-10 blur-[100px]" />

            <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#0b1015]/80 p-8 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-12">
                <div className="flex flex-col items-center">
                    <Link href="/">
                        <Logo size="lg" />
                    </Link>
                    <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-(--white-color)">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-(--secondary-color)">
                        Sign in to monitor your services
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-(--secondary-color)" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-(--white-color) placeholder:text-white/20 focus:border-(--primary-color) focus:outline-none focus:ring-1 focus:ring-(--primary-color) transition-colors"
                                placeholder="Prosper"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-(--secondary-color)" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-(--white-color) placeholder:text-white/20 focus:border-(--primary-color) focus:outline-none focus:ring-1 focus:ring-(--primary-color) transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-xl bg-(--primary-color) px-4 py-3 text-sm font-semibold text-[#05110e] transition hover:bg-[#63e0c2] focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:ring-offset-2 focus:ring-offset-(--background-color) disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center gap-2">
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </span>
                    </button>
                </form>

                <p className="text-center text-sm text-(--secondary-color)">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="font-semibold text-(--primary-color) hover:text-[#63e0c2]">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}