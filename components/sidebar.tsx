"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  Users,
  Gem,
  BarChart3,
  Brain,
  Settings,
  ChevronRight,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Job Analysis", href: "/analysis", icon: FileSearch },
  { label: "Candidates", href: "/candidates", icon: Users },
  { label: "Hidden Talent", href: "/hidden-talent", icon: Gem },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Explainability", href: "/explainability", icon: Brain },
];

const bottomLinks = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#f3f4f6] flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#f3f4f6]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#0a0a0a] rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-black">TL</span>
          </div>
          <div>
            <div className="text-xs font-black text-[#0a0a0a] leading-tight">TalentLens</div>
            <div className="label-caps text-[#71717a]" style={{ fontSize: "9px" }}>AI PLATFORM</div>
          </div>
        </Link>
      </div>

      {/* Live status */}
      <div className="px-5 py-3 border-b border-[#f3f4f6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot" />
            <span className="label-caps text-[#71717a]">System Active</span>
          </div>
          <span className="mono text-[10px] text-[#22c55e]">1,847</span>
        </div>
        <div className="label-caps text-[#a1a1aa] mt-0.5" style={{ fontSize: "9px" }}>Candidates analyzed</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="mb-4">
          <div className="label-caps text-[#a1a1aa] px-2 mb-2" style={{ fontSize: "9px" }}>Main</div>
          <div className="space-y-0.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-[#0a0a0a] text-white font-medium"
                      : "text-[#3f3f46] hover:bg-[#f4f4f5] font-medium"
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                  {isActive && <ChevronRight size={12} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-[#f3f4f6]">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#71717a] hover:bg-[#f4f4f5] font-medium transition-all"
            >
              <Icon size={15} />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <div className="mt-3 px-2.5 py-2.5 bg-[#f9fafb] rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0a0a0a] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">RC</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0a0a0a]">Recruiter</div>
              <div className="label-caps text-[#71717a]" style={{ fontSize: "9px" }}>Admin Access</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
