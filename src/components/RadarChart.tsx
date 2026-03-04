import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { RadarStat } from "../types";

interface RadarChartProps {
  data: RadarStat[];
}

export default function RadarChartComponent({ data }: RadarChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
        No data available for radar
      </div>
    );
  }

  // Transform data for Recharts if necessary
  const chartData = data.map(item => ({
    subject: item.category,
    A: item.count,
    fullMark: Math.max(...data.map(d => d.count)) + 2,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            fontSize: '12px',
            fontWeight: 'bold'
          }} 
        />
        <Radar
          name="Complaints"
          dataKey="A"
          stroke="#4f46e5"
          fill="#4f46e5"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
