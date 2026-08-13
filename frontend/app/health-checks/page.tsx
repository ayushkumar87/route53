"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function HealthChecksPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Health checks" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-aws-text)]">Health checks</h1>
        <p className="text-sm text-[var(--color-aws-text-muted)] mt-1">
          Monitor the health and performance of your web applications.
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