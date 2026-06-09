"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/mock-data";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#0a0a0a] rounded flex items-center justify-center">
            <span className="text-white text-xs font-black">TL</span>
          </div>
          <span className="font-black text-[#0a0a0a] text-sm tracking-tight">TalentLens AI</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`label-caps transition-colors ${
                pathname === link.href
                  ? "text-[#0a0a0a]"
                  : "text-[#71717a] hover:text-[#0a0a0a]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot" />
            <span className="label-caps text-[#71717a]">Live</span>
          </div>
          <Link
            href="/analysis"
            className="px-4 py-2 bg-[#0a0a0a] text-white text-xs font-bold rounded-lg hover:bg-[#18181b] transition-colors"
          >
            Analyze Candidates
          </Link>
        </div>
      </div>
    </header>
  );
}
