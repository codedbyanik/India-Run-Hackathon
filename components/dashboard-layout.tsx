"use client";

import Sidebar from "@/components/sidebar";
import { Bell, Search } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-[#f3f4f6] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {title && (
              <div>
                <h1 className="text-sm font-bold text-[#0a0a0a]">{title}</h1>
                {subtitle && <p className="label-caps text-[#71717a]">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#f3f4f6] rounded-lg px-3 py-2">
              <Search size={13} className="text-[#71717a]" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="text-xs text-[#0a0a0a] placeholder:text-[#71717a] bg-transparent outline-none w-40"
              />
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors relative">
              <Bell size={14} className="text-[#71717a]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
