"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "GitHub", href: "https://github.com/SuhasKanwar/Uptiq", external: true },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-100 border-b border-transparent bg-(--background-color)/60 px-8 py-4 backdrop-blur-[20px] transition-all duration-300 ${scrolled ? "border-b border-(--accent-glow) bg-(--background-color)/90" : ""}`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="text-(--white-color)">
                    <Logo
                        size="lg"
                        priority
                        imageClassName="shadow-[0_0_20px_var(--accent-glow)]"
                    />
                </Link>

                <ul className="hidden list-none items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="relative text-sm font-medium text-(--secondary-color) transition-colors hover:text-(--white-color) after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded after:bg-(--primary-color) after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <button className="rounded-lg px-5 py-2 text-sm font-medium text-(--white-color) transition hover:bg-white/5">
                        Sign In
                    </button>
                    <button className="rounded-lg bg-[linear-gradient(135deg,var(--primary-color),var(--primary-color))] px-6 py-2 text-sm font-semibold text-white shadow-[0_0_20px_var(--accent-glow)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_var(--accent-glow)]">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
}