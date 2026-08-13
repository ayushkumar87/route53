"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Activity, 
  Map, 
  ShieldAlert, 
  Settings 
} from "lucide-react";

const navigation = [
  { name: "Hosted zones", href: "/hosted-zones", icon: Globe },
  { name: "Traffic policies", href: "/traffic-policies", icon: Map },
  { name: "Health checks", href: "/health-checks", icon: Activity },
  { name: "Resolver", href: "/resolver", icon: Settings },
  { name: "Profiles", href: "/profiles", icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 flex-shrink-0 bg-[var(--color-aws-nav)] h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-[#1a232e]">
      <nav className="px-2 py-4 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Dashboard
        </div>
        <Link
          href="/dashboard"
          className={cn(
            pathname === "/dashboard"
              ? "bg-[var(--color-aws-link)] text-white"
              : "text-gray-300 hover:bg-[#1a232e] hover:text-white",
            "group flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors"
          )}
        >
          Dashboard
        </Link>
        
        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          DNS Management
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                isActive
                  ? "bg-[#1a232e] text-white border-l-4 border-[var(--color-aws-primary)]"
                  : "text-gray-300 hover:bg-[#1a232e] hover:text-white border-l-4 border-transparent",
                "group flex items-center px-3 py-2 text-sm font-medium transition-colors"
              )}
            >
              <item.icon
                className={cn(
                  isActive ? "text-[var(--color-aws-primary)]" : "text-gray-400 group-hover:text-gray-300",
                  "flex-shrink-0 mr-3 h-5 w-5"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
