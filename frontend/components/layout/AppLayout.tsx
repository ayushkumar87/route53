"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { AuthGuard } from "../AuthGuard";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[var(--color-aws-bg)]">
        <Header />
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 focus:outline-none">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
