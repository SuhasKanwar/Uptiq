import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    icon: ReactNode;
    value: string | ReactNode;
    subtitle: string | ReactNode;
}

export default function StatsCard({ title, icon, value, subtitle }: StatsCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 text-(--secondary-color)">
                {icon}
                <h3 className="font-medium">{title}</h3>
            </div>
            <div className="flex items-end gap-2">
                <div className="text-3xl font-bold text-(--white-color)">{value}</div>
            </div>
            <div className="mt-2 text-sm text-(--secondary-color)">{subtitle}</div>
        </div>
    );
}