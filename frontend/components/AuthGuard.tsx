"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !token && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [isLoading, token, router, pathname]);

  if (isLoading || (!token && pathname !== "/login" && pathname !== "/register")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-aws-bg)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-aws-primary)]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
