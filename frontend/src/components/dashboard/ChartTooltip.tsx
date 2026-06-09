import { Clock } from "lucide-react";

export function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-lg bg-black/95 px-4 py-3 text-sm text-white border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1.5 border-b border-white/10 pb-1.5">
                    <Clock className="h-3.5 w-3.5 text-(--secondary-color)" />
                    <span className="text-(--secondary-color) text-xs font-medium">
                        {data.timeLabel}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-6 mb-1">
                    <span className="text-white/70">Response Time:</span>
                    <span className="font-semibold text-white">
                        {data.responseTime} ms
                    </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                    <span className="text-white/70">Status:</span>
                    <span className={`font-semibold ${data.status === 'Up' ? 'text-[#63e0c2]' : 'text-red-400'}`}>
                        {data.status.toUpperCase()}
                    </span>
                </div>
            </div>
        );
    }
    return null;
}