"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Globe, Layers, Plus, Map } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ total_zones: 0, total_records: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function loadStats() {
      try {
        const response = await fetch("http://127.0.0.1:8000/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [token]);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-aws-text)]">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-aws-text-muted)] mb-1">
                  Total Hosted Zones
                </p>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <h3 className="text-3xl font-bold text-[var(--color-aws-text)]">{stats.total_zones}</h3>
                )}
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Globe className="h-6 w-6 text-[var(--color-aws-link)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-aws-text-muted)] mb-1">
                  Total DNS Records
                </p>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <h3 className="text-3xl font-bold text-[var(--color-aws-text)]">{stats.total_records}</h3>
                )}
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Layers className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used Route 53 actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/hosted-zones" className="block p-4 border border-[var(--color-aws-border)] rounded-sm hover:border-[var(--color-aws-link)] hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-aws-bg)] rounded-sm group-hover:bg-blue-50">
                  <Globe className="h-5 w-5 text-[var(--color-aws-text-muted)] group-hover:text-[var(--color-aws-link)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm group-hover:text-[var(--color-aws-link)]">Manage Hosted Zones</h4>
                  <p className="text-xs text-[var(--color-aws-text-muted)] mt-1">Create, view, and manage your domain&apos;s DNS settings.</p>
                </div>
              </div>
            </Link>
            
            <div className="p-4 border border-[var(--color-aws-border)] rounded-sm opacity-60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-aws-bg)] rounded-sm">
                  <Map className="h-5 w-5 text-[var(--color-aws-text-muted)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Traffic Policies (Coming Soon)</h4>
                  <p className="text-xs text-[var(--color-aws-text-muted)] mt-1">Route end users to the best endpoint for your application.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}