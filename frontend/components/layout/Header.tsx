"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[var(--color-aws-header)] flex items-center justify-between px-4 text-white">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg hover:text-[var(--color-aws-primary)] transition-colors">
          <span className="text-[var(--color-aws-primary)] text-xl mr-1">☁</span>
          AWS Route53 Clone
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="h-4 w-4" />
          <span>My Account</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-gray-300 hover:text-white hover:bg-white/10 ml-2">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
