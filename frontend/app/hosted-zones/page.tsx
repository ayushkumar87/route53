"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Search, Plus, Trash2, Edit2, RefreshCw } from "lucide-react";
import Link from "next/link";

type HostedZone = {
  id: number;
  name: string;
  description: string | null;
};

export default function HostedZonesPage() {
  const { token } = useAuth();

  const [zones, setZones] = useState<HostedZone[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Search & Pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Delete State
  const [zoneToDelete, setZoneToDelete] = useState<HostedZone | null>(null);

  async function loadZones() {
    if (!token) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/hosted-zones?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setZones(data.data);
        setTotal(data.total);
      }
    } catch {
      console.log("Backend unavailable");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadZones();
  }, [search, page, token]);

  async function saveZone() {
    if (!token) return;

    const url = editingId
      ? `http://127.0.0.1:8000/hosted-zones/${editingId}`
      : "http://127.0.0.1:8000/hosted-zones";

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.detail || "Operation failed");
      return;
    }

    closeModal();
    if (!editingId) setPage(1);
    loadZones();
  }

  async function confirmDeleteZone() {
    if (!token || !zoneToDelete) return;

    const response = await fetch(
      `http://127.0.0.1:8000/hosted-zones/${zoneToDelete.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      setZoneToDelete(null);
      loadZones();
    }
  }

  function startEdit(zone: HostedZone) {
    setEditingId(zone.id);
    setName(zone.name);
    setDescription(zone.description || "");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setDescription("");
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <Breadcrumbs items={[{ label: "Hosted zones" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-aws-text)]">Hosted zones</h1>
          <p className="text-sm text-[var(--color-aws-text-muted)] mt-1">
            Create and manage the domains and subdomains that you want to route traffic for.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadZones} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create hosted zone
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-aws-border)] rounded-sm shadow-sm mb-6">
        <div className="p-4 border-b border-[var(--color-aws-border)] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--color-aws-text-muted)]" />
            </div>
            <Input
              type="text"
              placeholder="Find hosted zones by domain name"
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="text-sm text-[var(--color-aws-text-muted)] flex items-center">
            {total} hosted {total === 1 ? 'zone' : 'zones'}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-aws-primary)]"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : zones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-[var(--color-aws-text-muted)]">
                  {search ? "No hosted zones match your search." : "You have no hosted zones."}
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium text-[var(--color-aws-link)] hover:underline">
                    <Link href={`/hosted-zones/${zone.id}`}>{zone.name}</Link>
                  </TableCell>
                  <TableCell>Public</TableCell>
                  <TableCell className="text-[var(--color-aws-text-muted)] truncate max-w-[200px]">
                    {zone.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(zone)}>
                        <Edit2 className="h-4 w-4 text-[var(--color-aws-text-muted)]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setZoneToDelete(zone)}>
                        <Trash2 className="h-4 w-4 text-[var(--color-aws-danger)]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Hosted Zone" : "Create Hosted Zone"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveZone} disabled={!name}>
              {editingId ? "Save changes" : "Create hosted zone"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-aws-text)]">
              Domain name <span className="text-[var(--color-aws-danger)]">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="example.com"
            />
            <p className="text-xs text-[var(--color-aws-text-muted)]">
              Enter the domain name that you want to route traffic for.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-aws-text)]">
              Description
            </label>
            <textarea
              className="flex w-full rounded-sm border border-[var(--color-aws-secondary-border)] bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-aws-link)] resize-none"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!zoneToDelete}
        onClose={() => setZoneToDelete(null)}
        onConfirm={confirmDeleteZone}
        title="Delete Hosted Zone"
        description={`Are you sure you want to delete the hosted zone "${zoneToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}