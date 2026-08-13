"use client";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ProfilesPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Profiles" }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-aws-text)]">Profiles</h1>
        <p className="text-sm text-[var(--color-aws-text-muted)] mt-1">
          Manage Route 53 Profiles for your AWS environment.
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