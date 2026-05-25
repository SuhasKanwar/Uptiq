"use client";

import dynamic from "next/dynamic";

const GlobeScene = dynamic(() => import("./GlobeScene"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center">
            <div className="h-15 w-15 animate-spin rounded-full border-2 border-(--accent-glow) border-t-(--primary-color)" />
        </div>
    ),
});

export default function HeroSection() {
    const stats = [
        { value: "99.99%", label: "Platform uptime" },
        { value: "<3s", label: "Detection time" },
        { value: "Multi-region", label: "Distributed polling" },
    ];

    const statusCards = [
        {
            label: "api.example.com",
            metric: "42ms",
            positionClass: "right-[5%] top-[10%]",
            dotClass: "bg-(--primary-color)",
            delayClass: "",
        },
        {
            label: "dashboard.io",
            metric: "128ms",
            positionClass: "bottom-[25%] left-[0%]",
            dotClass: "bg-(--primary-color)",
            delayClass: "[animation-delay:-2s]",
        },
        {
            label: "payments.svc",
            metric: "timeout",
            positionClass: "right-[-5%] top-[40%]",
            dotClass: "bg-(--secondary-color)",
            delayClass: "[animation-delay:-4s]",
        },
    ];

    return (
        <section className="relative flex min-h-screen items-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--accent-glow),transparent),radial-gradient(ellipse_60%_40%_at_80%_60%,var(--accent-glow),transparent)]" />
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--accent-glow)_1px,transparent_1px),linear-gradient(90deg,var(--accent-glow)_1px,transparent_1px)] bg-size-[60px_60px]"
                style={{ maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent)" }}
            />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-8 pb-16 pt-32 text-center lg:grid-cols-2 lg:text-left">
                <div className="flex flex-col items-center gap-7 lg:items-start">
                    <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-(--white-color)">
                        Know when your
                        <br />
                        services go{" "}
                        <span className="bg-[linear-gradient(135deg,var(--primary-color),var(--primary-color))] bg-clip-text text-transparent">down</span>
                        <br />
                        before your users do.
                    </h1>

                    <p className="max-w-130 text-[1.1rem] leading-7 text-(--secondary-color)">
                        Uptiq continuously monitors your websites and APIs from distributed
                        nodes worldwide. Detect outages in seconds, not minutes — with
                        instant alerts across Slack, email, and webhooks.
                    </p>

                    <div className="mt-2 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                        <a
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(135deg,var(--primary-color),var(--primary-color))] px-8 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_30px_var(--accent-glow)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_40px_var(--accent-glow)]"
                        >
                            Start Monitoring
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/SuhasKanwar/Uptiq"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-(--border-color) px-8 py-3.5 text-[0.95rem] font-medium text-(--white-color) transition hover:border-(--primary-color) hover:bg-(--primary-color)/10"
                        >
                            View on GitHub
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-6 border-t border-white/5 pt-6 lg:justify-start">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col gap-1">
                                <span className="text-2xl font-bold text-(--white-color)">{stat.value}</span>
                                <span className="text-xs font-normal text-(--secondary-color)">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex h-87.5 w-full items-center justify-center md:h-112.5 lg:h-150">
                    <div className="absolute inset-0">
                        <GlobeScene />
                    </div>
                    {statusCards.map((card) => (
                        <div
                            key={card.label}
                            className={`hidden md:flex absolute ${card.positionClass} z-10 items-center gap-2 rounded-[10px] border border-(--accent-glow) bg-(--surface-color)/85 px-3 py-2 text-xs font-medium text-(--white-color) shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md animate-[float-card_6s_ease-in-out_infinite] ${card.delayClass}`}
                        >
                            <span className={`h-2 w-2 shrink-0 rounded-full ${card.dotClass} shadow-[0_0_8px_var(--accent-glow)]`} />
                            {card.label}
                            <span className="text-[0.7rem] text-(--secondary-color)">{card.metric}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}