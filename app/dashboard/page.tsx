"use client";

import DashboardLayout from "@/components/dashboard-layout";
import MetricCard from "@/components/ui/metric-card";
import StatusBadge from "@/components/ui/status-badge";
import { analyticsData, candidates } from "@/lib/mock-data";
import { TrendingUp, FileText, Users, Activity, Clock } from "lucide-react";
import Link from "next/link";

const recentJobs = [
  { id: "j1", title: "Senior ML Engineer", dept: "AI Research", candidates: 312, status: "Active", match: 96, date: "2h ago" },
  { id: "j2", title: "Staff Engineer — Infra", dept: "Platform", candidates: 187, status: "Active", match: 89, date: "5h ago" },
  { id: "j3", title: "AI Research Scientist", dept: "Research", candidates: 243, status: "Analysis", match: 94, date: "1d ago" },
  { id: "j4", title: "Product Manager — AI", dept: "Product", candidates: 156, status: "Ranked", match: 82, date: "2d ago" },
  { id: "j5", title: "Data Engineer", dept: "Data Platform", candidates: 94, status: "Ranked", match: 76, date: "3d ago" },
];

const activity = [
  { event: "Candidate ranked #1", name: "Priya Sharma", score: 96, time: "2m ago", type: "rank" },
  { event: "Hidden talent discovered", name: "Aisha Okonkwo", score: 91, time: "8m ago", type: "hidden" },
  { event: "JD analysis complete", name: "Senior ML Engineer", score: null, time: "14m ago", type: "analysis" },
  { event: "Trust verified", name: "Marcus Chen", score: 94, time: "31m ago", type: "trust" },
  { event: "Behavioral analysis", name: "Zara Nwosu", score: 85, time: "1h ago", type: "behavior" },
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Overview"
      subtitle="Recruiter Intelligence Dashboard"
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Candidates Processed"
          value={analyticsData.candidatesProcessed.toLocaleString()}
          change={18}
          changeLabel="vs last week"
        />
        <MetricCard
          label="Avg Match Score"
          value={analyticsData.averageMatchScore.toFixed(1)}
          unit="%"
          change={+12}
          changeLabel="vs last cohort"
        />
        <MetricCard
          label="Hidden Talent Found"
          value={analyticsData.hiddenTalentDiscovered.count}
          sublabel={`${analyticsData.hiddenTalentDiscovered.percentage}% of total`}
          change={+7}
          changeLabel="vs last month"
        />
        <MetricCard
          label="Time to Hire"
          value={analyticsData.timeToHire.current}
          unit="days"
          change={analyticsData.timeToHire.change}
          changeLabel="vs last quarter"
          accent
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white border border-[#f3f4f6] rounded-xl">
          <div className="px-5 py-4 border-b border-[#f3f4f6] flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-[#0a0a0a]">Recent Jobs</div>
              <div className="label-caps text-[#71717a]">Active analyses</div>
            </div>
            <Link href="/analysis" className="label-caps text-[#2563eb] hover:text-[#1d4ed8]">
              New Analysis →
            </Link>
          </div>
          <div className="divide-y divide-[#f9fafb]">
            {recentJobs.map((job) => (
              <div key={job.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#f9fafb] transition-colors">
                <div className="w-8 h-8 bg-[#f4f4f5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={13} className="text-[#71717a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#0a0a0a] truncate">{job.title}</div>
                  <div className="label-caps text-[#71717a]">{job.dept} · {job.candidates} candidates</div>
                </div>
                <div className="text-right">
                  <div className="mono text-sm font-bold text-[#0a0a0a]">{job.match}</div>
                  <div className="label-caps text-[#71717a]">top match</div>
                </div>
                <StatusBadge
                  label={job.status}
                  variant={
                    job.status === "Active" ? "success" :
                    job.status === "Analysis" ? "blue" : "neutral"
                  }
                  dot
                />
                <div className="label-caps text-[#a1a1aa] w-12 text-right">{job.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Activity Feed */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl">
            <div className="px-5 py-4 border-b border-[#f3f4f6]">
              <div className="font-bold text-sm text-[#0a0a0a]">Live Activity</div>
              <div className="label-caps text-[#71717a]">Real-time candidate signals</div>
            </div>
            <div className="divide-y divide-[#f9fafb]">
              {activity.map((a, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    a.type === "hidden" ? "bg-[#22c55e]" :
                    a.type === "rank" ? "bg-[#2563eb]" :
                    a.type === "trust" ? "bg-[#22c55e]" : "bg-[#71717a]"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#0a0a0a]">{a.event}</div>
                    <div className="text-[11px] text-[#71717a]">{a.name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {a.score && <div className="mono text-[11px] font-bold text-[#0a0a0a]">{a.score}</div>}
                    <div className="label-caps text-[#a1a1aa]">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="font-bold text-sm text-[#0a0a0a] mb-4">System Health</div>
            <div className="space-y-3">
              {[
                { name: "JD Intelligence", status: "Operational", uptime: "99.9%" },
                { name: "Semantic Engine", status: "Operational", uptime: "99.7%" },
                { name: "Behavioral Analyzer", status: "Operational", uptime: "99.8%" },
                { name: "Ranking Engine", status: "Operational", uptime: "100%" },
              ].map((sys) => (
                <div key={sys.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot" />
                    <span className="text-[11px] font-medium text-[#0a0a0a]">{sys.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] text-[#71717a]">{sys.uptime}</span>
                    <StatusBadge label={sys.status} variant="success" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link href="/analysis" className="p-3 bg-[#0a0a0a] rounded-xl hover:bg-[#18181b] transition-colors group">
              <FileText size={14} className="text-white mb-2" />
              <div className="text-xs font-bold text-white">New Analysis</div>
              <div className="label-caps text-[#52525b]">Parse JD</div>
            </Link>
            <Link href="/candidates" className="p-3 bg-white border border-[#f3f4f6] rounded-xl hover:border-[#d4d4d8] transition-colors">
              <Users size={14} className="text-[#0a0a0a] mb-2" />
              <div className="text-xs font-bold text-[#0a0a0a]">Rankings</div>
              <div className="label-caps text-[#71717a]">View all</div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
