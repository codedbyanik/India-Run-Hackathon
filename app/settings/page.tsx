"use client";

import DashboardLayout from "@/components/dashboard-layout";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Platform configuration">
      <div className="max-w-2xl space-y-4">
        {[
          { label: "API Configuration", desc: "Manage API keys and endpoints" },
          { label: "Scoring Weights", desc: "Adjust ranking factor weights" },
          { label: "Notification Preferences", desc: "Configure alert settings" },
          { label: "Data Privacy", desc: "GDPR and data retention settings" },
          { label: "Team Access", desc: "Manage recruiter permissions" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[#f3f4f6] rounded-xl p-5 flex items-center justify-between hover:border-[#d4d4d8] transition-colors cursor-pointer"
          >
            <div>
              <div className="text-sm font-bold text-[#0a0a0a]">{s.label}</div>
              <div className="label-caps text-[#71717a] mt-0.5">{s.desc}</div>
            </div>
            <div className="text-[#d4d4d8] text-sm">→</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
