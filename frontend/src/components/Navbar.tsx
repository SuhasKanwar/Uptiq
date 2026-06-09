"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Menu, X } from "lucide-react";

const navLinks = [
    { label: "Signals", href: "#signals" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "GitHub", href: "https://github.com/SuhasKanwar/Uptiq", external: true },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-[100] px-4 pt-4 sm:px-6">
            <nav
                className={`mx-auto max-w-7xl border transition duration-300 ${
                    scrolled
                        ? "border-white/[0.14] bg-[#081015]/[0.86] shadow-[0_16px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                        : "border-white/[0.08] bg-[#081015]/[0.48] backdrop-blur-md"
                }`}
            >
                <div className="flex min-h-16 items-center justify-between px-4 sm:px-5">
                    <Link href="/" className="flex items-center text-(--white-color)" onClick={() => setMenuOpen(false)}>
                        <Logo
                            size="lg"
                            priority
                            imageClassName="rounded-none shadow-[0_0_24px_rgba(65,209,170,0.2)]"
                            textClassName="font-semibold"
                        />
                    </Link>

                    <ul className="hidden items-center gap-1 md:flex">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="px-4 py-2 text-sm font-medium text-(--secondary-color) transition hover:bg-white/[0.055] hover:text-(--white-color)"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden items-center gap-2 md:flex">
                        {status === "authenticated" ? (
                            <>
                                <span className="px-4 py-2 text-sm font-medium text-(--secondary-color)">
                                    {session.user?.name}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-white/10 px-4 py-2 text-sm font-semibold text-(--white-color) transition hover:bg-white/20"
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="px-4 py-2 text-sm font-semibold text-(--white-color) transition hover:bg-white/[0.055]"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="bg-(--white-color) px-4 py-2 text-sm font-semibold text-[#06100d] transition hover:bg-(--primary-color)"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center border border-white/[0.12] text-(--white-color) transition hover:bg-white/[0.07] md:hidden"
                        aria-label="Toggle navigation"
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {menuOpen ? (
                    <div className="border-t border-white/[0.1] px-4 pb-4 pt-2 md:hidden">
                        <div className="grid gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    className="px-3 py-3 text-sm font-medium text-(--secondary-color) transition hover:bg-white/[0.055] hover:text-(--white-color)"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {status === "authenticated" ? (
                                <>
                                    <span className="px-3 py-3 text-center text-sm font-semibold text-(--secondary-color) ring-1 ring-white/[0.12]">
                                        {session.user?.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            signOut();
                                        }}
                                        className="bg-white/10 px-3 py-3 text-center text-sm font-semibold text-(--white-color)"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="px-3 py-3 text-center text-sm font-semibold text-(--white-color) ring-1 ring-white/[0.12]"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="bg-(--primary-color) px-3 py-3 text-center text-sm font-semibold text-[#06100d]"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Get started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ) : null}
            </nav>
        </header>
    );
}
