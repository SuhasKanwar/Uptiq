import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { ChartDataPoint } from "@/utils/chart";
import { CustomTooltip } from "./ChartTooltip";

interface LineChartProps {
    data: ChartDataPoint[];
}

export default function LineChart({ data }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="timeLabel" hide />
                <YAxis hide domain={[0, 'dataMax']} />
                <RechartsTooltip
                    content={<CustomTooltip />}
                    isAnimationActive={false}
                />
                <Line
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#41d1aa"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#0b1015", stroke: "#41d1aa", strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: "#41d1aa", stroke: "#fff", strokeWidth: 2 }}
                    isAnimationActive={false}
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
}