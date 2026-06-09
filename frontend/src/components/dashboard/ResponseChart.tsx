import { useState } from "react";
import { WebsiteTick } from "@/utils/websites";
import { BarChart3, AlertTriangle, LineChart as LineChartIcon, Activity } from "lucide-react";
import { ChartType, TimeSpan, filterTicks, formatChartData } from "@/utils/chart";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

interface ResponseChartProps {
    ticks: WebsiteTick[];
}

export default function ResponseChart({ ticks }: ResponseChartProps) {
    const [chartType, setChartType] = useState<ChartType>("bar");
    const [timeSpan, setTimeSpan] = useState<TimeSpan>("all");

    const sortedTicks = [...ticks].sort((a, b) => a.created_at - b.created_at);
    const filteredTicks = filterTicks(sortedTicks, timeSpan);

    if (sortedTicks.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="h-8 w-8 text-(--secondary-color) mb-3 opacity-50" />
                    <p className="text-sm font-medium text-(--white-color)">No telemetry data yet</p>
                    <p className="mt-1 text-xs text-(--secondary-color)">Waiting for the first ping...</p>
                </div>
            </div>
        );
    }

    const chartData = formatChartData(filteredTicks);

    return (
        <div className="rounded-2xl border border-white/10 bg-[#0b1015]/60 p-6 shadow-lg backdrop-blur-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/5 p-2 border border-white/10">
                        {chartType === 'bar' ? <BarChart3 className="h-5 w-5 text-(--white-color)" /> : <LineChartIcon className="h-5 w-5 text-(--white-color)" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-(--white-color)">Response Times</h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 border border-white/10">
                        {(["1h", "6h", "24h", "all"] as TimeSpan[]).map((span) => (
                            <button
                                key={span}
                                onClick={() => setTimeSpan(span)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition ${timeSpan === span ? 'bg-(--primary-color) text-[#05110e]' : 'text-(--secondary-color) hover:text-white'}`}
                            >
                                {span.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 border border-white/10">
                        <button
                            onClick={() => setChartType("bar")}
                            className={`p-1.5 rounded-md transition ${chartType === "bar" ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                            title="Bar Chart"
                        >
                            <BarChart3 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setChartType("line")}
                            className={`p-1.5 rounded-md transition ${chartType === "line" ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                            title="Line Chart"
                        >
                            <Activity className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full">
                {filteredTicks.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-(--secondary-color)">
                        No data available for the selected timeframe.
                    </div>
                ) : chartType === "bar" ? (
                    <BarChart data={chartData} />
                ) : (
                    <LineChart data={chartData} />
                )}
            </div>

            {filteredTicks.length > 0 && (
                <div className="flex justify-between mt-4 text-xs text-(--secondary-color) border-t border-white/5 pt-4">
                    <span>{chartData[0].timeLabel}</span>
                    <span>{chartData[chartData.length - 1].timeLabel}</span>
                </div>
            )}
        </div>
    );
}