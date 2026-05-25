import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
    const columns = [
        {
            title: "Product",
            links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Status Page", href: "/status" },
            ],
        },
        {
            title: "Developers",
            links: [
                { label: "GitHub", href: "https://github.com/SuhasKanwar/Uptiq", external: true },
                { label: "API Docs", href: "/docs" },
                { label: "Self-Hosting", href: "/docs/self-host" },
                { label: "Changelog", href: "/changelog" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Contact", href: "/contact" },
            ],
        },
    ];

    const socials = [
        {
            label: "GitHub",
            href: "https://github.com/SuhasKanwar/Uptiq",
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
            ),
        },
        {
            label: "X (Twitter)",
            href: "https://x.com",
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-(--accent-glow) bg-(--surface-color) px-8 pb-8 pt-16">
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[40%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--primary-color),transparent)]" />
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 border-b border-white/5 pb-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
                    <div className="flex flex-col gap-4">
                        <Logo size="md" />
                        <p className="max-w-[320px] text-sm leading-6 text-(--secondary-color)">
                            Scalable website monitoring platform with distributed pollers,
                            real-time outage detection, and instant multi-channel alerts.
                        </p>
                    </div>
                    {columns.map((column) => (
                        <div key={column.title}>
                            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.08em] text-(--white-color)">
                                {column.title}
                            </h4>
                            <ul className="flex list-none flex-col gap-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            className="text-sm text-(--secondary-color) transition-colors hover:text-(--primary-color)"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center md:flex-row md:text-left">
                    <p className="text-xs text-(--secondary-color)">
                        © {new Date().getFullYear()} Uptiq. Built by{" "}
                        <Link
                            href="https://suhaskanwar.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-(--primary-color) no-underline"
                        >
                            Suhas Kanwar
                        </Link>
                    </p>

                    <div className="flex gap-3">
                        {socials.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-(--secondary-color) transition hover:border-(--accent-glow) hover:bg-(--primary-color)/10 hover:text-(--primary-color)"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}