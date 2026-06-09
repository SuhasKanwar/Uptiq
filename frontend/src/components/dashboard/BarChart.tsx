import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import { ChartDataPoint } from "@/utils/chart";
import { CustomTooltip } from "./ChartTooltip";

interface BarChartProps {
    data: ChartDataPoint[];
}

export default function BarChart({ data }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="timeLabel" hide />
                <YAxis hide domain={[0, 'dataMax']} />
                <RechartsTooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                    isAnimationActive={false}
                />
                <Bar dataKey="responseTime" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                    {data.map((entry, index) => {
                        const isDown = entry.status === "Down";
                        const isHigh = entry.responseTime > 300;
                        let fill = "#41d1aa"; 
                        let opacity = 0.5;
                        if (isDown) { fill = "#ef4444"; opacity = 1; }
                        else if (isHigh) { fill = "#eab308"; opacity = 0.8; }
                        return <Cell key={`cell-${index}`} fill={fill} fillOpacity={opacity} />;
                    })}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}