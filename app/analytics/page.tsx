"use client";

import DashboardLayout from "@/components/dashboard-layout";
import MetricCard from "@/components/ui/metric-card";
import { analyticsData } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const COLORS = ["#0a0a0a", "#27272a", "#3f3f46", "#52525b", "#71717a", "#a1a1aa", "#d4d4d8"];

const monthlyHires = [
  { month: "Aug", quality: 62, time: 38 },
  { month: "Sep", quality: 67, time: 35 },
  { month: "Oct", quality: 71, time: 31 },
  { month: "Nov", quality: 75, time: 28 },
  { month: "Dec", quality: 82, time: 24 },
  { month: "Jan", quality: 88, time: 21 },
  { month: "Feb", quality: 91, time: 18 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e4e4e7] rounded-lg p-3 shadow-sm">
        <div className="label-caps text-[#71717a] mb-2">{label}</div>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="label-caps text-[#71717a]">{p.name}:</span>
            <span className="mono text-xs font-bold text-[#0a0a0a]">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Hiring Analytics"
      subtitle="Enterprise intelligence metrics"
    >
      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <MetricCard
          label="Time To Hire"
          value={analyticsData.timeToHire.current}
          unit="days"
          change={analyticsData.timeToHire.change}
          changeLabel="vs Q3"
        />
        <MetricCard
          label="Quality Score"
          value={analyticsData.qualityScore.current}
          unit="%"
          change={+34}
          changeLabel="vs baseline"
        />
        <MetricCard
          label="Hidden Talent Discovered"
          value={analyticsData.hiddenTalentDiscovered.count}
          sublabel={`${analyticsData.hiddenTalentDiscovered.percentage}% of shortlist`}
          change={+7}
        />
        <MetricCard
          label="Candidates Processed"
          value={analyticsData.candidatesProcessed.toLocaleString()}
          change={+18}
          changeLabel="vs last period"
          accent
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Quality Score Trend */}
        <div className="lg:col-span-2 bg-white border border-[#f3f4f6] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-bold text-sm text-[#0a0a0a]">Hiring Quality vs Time-to-Hire</div>
              <div className="label-caps text-[#71717a]">Month over month trend</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#0a0a0a]" />
                <span className="label-caps text-[#71717a]">Quality Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#d4d4d8]" />
                <span className="label-caps text-[#71717a]">Days to Hire</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyHires}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f9fafb" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#71717a", fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="quality" name="Quality" stroke="#0a0a0a" strokeWidth={2} fill="url(#colorQuality)" />
              <Area type="monotone" dataKey="time" name="Days to Hire" stroke="#d4d4d8" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Behavior Distribution */}
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
          <div className="font-bold text-sm text-[#0a0a0a] mb-1">Behavior Distribution</div>
          <div className="label-caps text-[#71717a] mb-4">Candidate profile types</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={analyticsData.behaviorDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="count"
                stroke="none"
              >
                {analyticsData.behaviorDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {analyticsData.behaviorDistribution.map((item, i) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="label-caps text-[#71717a]">{item.type}</span>
                </div>
                <span className="mono text-[10px] font-bold text-[#0a0a0a]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Skill Demand */}
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
          <div className="font-bold text-sm text-[#0a0a0a] mb-1">Skill Demand</div>
          <div className="label-caps text-[#71717a] mb-4">Top skills in demand this period</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.skillDemand} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="skill" tick={{ fontSize: 9, fill: "#0a0a0a", fontWeight: 700 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" name="Demand Score" fill="#0a0a0a" radius={[0, 3, 3, 0]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Funnel */}
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
          <div className="font-bold text-sm text-[#0a0a0a] mb-1">Hiring Funnel</div>
          <div className="label-caps text-[#71717a] mb-4">Candidate pipeline progression</div>
          <div className="space-y-2.5">
            {analyticsData.hiringFunnel.map((stage) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="label-caps text-[#71717a]">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] font-bold text-[#0a0a0a]">{stage.count.toLocaleString()}</span>
                    <span className="label-caps text-[#a1a1aa]">{stage.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0a0a0a] transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Distribution */}
      <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
        <div className="font-bold text-sm text-[#0a0a0a] mb-1">Candidate Score Distribution</div>
        <div className="label-caps text-[#71717a] mb-5">TalentLens fit scores across 1,847 candidates</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={analyticsData.candidateDistribution}>
            <CartesianGrid stroke="#f9fafb" vertical={false} />
            <XAxis dataKey="score" tick={{ fontSize: 9, fill: "#71717a", fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Candidates" radius={[3, 3, 0, 0]} maxBarSize={36}>
              {analyticsData.candidateDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#22c55e" : index === 1 ? "#2563eb" : "#e4e4e7"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#22c55e]" />
            <span className="label-caps text-[#71717a]">Top tier (90+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#2563eb]" />
            <span className="label-caps text-[#71717a]">Strong match (80-89)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-[#e4e4e7]" />
            <span className="label-caps text-[#71717a]">All others</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
