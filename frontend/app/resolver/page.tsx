"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ResolverPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Resolver" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-aws-text)]">Resolver</h1>
        <p className="text-sm text-[var(--color-aws-text-muted)] mt-1">
          Configure DNS resolution between your VPCs and your on-premises networks.
        </p>
      </div>
      <div className="bg-white border border-[var(--color-aws-border)] rounded-sm p-12 text-center shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-[var(--color-aws-text-muted)]">
          This feature is currently under development.
        </p>
      </div>
    </div>
  );
}