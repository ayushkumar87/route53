"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Search, Plus, Trash2, Edit2, RefreshCw, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

type HostedZone = {
  id: number;
  name: string;
  description: string | null;
};

type DNSRecord = {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
};

const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];

export default function HostedZoneDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { token } = useAuth();
  
  const zoneId = parseInt(params.id, 10);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Pagination
  const [search, setSearch] = useState("");
  const [recordType, setRecordType] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("A");
  const [formValue, setFormValue] = useState("");
  const [formTtl, setFormTtl] = useState(300);

  // Delete State
  const [recordToDelete, setRecordToDelete] = useState<DNSRecord | null>(null);

  useEffect(() => {
    if (!token) return;
    
    async function fetchZone() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/hosted-zones/${zoneId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setZone(data);
        } else {
          router.push("/hosted-zones");
        }
      } catch {
        console.log("Failed to fetch zone details");
      }
    }
    
    fetchZone();
  }, [token, zoneId, router]);

  async function loadRecords() {
    if (!token) return;
    setIsLoading(true);

    try {
      const query = new URLSearchParams({
        search,
        record_type: recordType,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(
        `http://127.0.0.1:8000/hosted-zones/${zoneId}/records?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecords(data.data);
        setTotal(data.total);
      }
    } catch {
      console.log("Backend unavailable");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [search, recordType, page, token, zoneId]); // Removed loadRecords from dependency array

  async function saveRecord() {
    if (!token) return;

    const url = editingId
      ? `http://127.0.0.1:8000/records/${editingId}`
      : `http://127.0.0.1:8000/records`;

    const body = {
      hosted_zone_id: zoneId,
      name: formName,
      type: formType,
      value: formValue,
      ttl: formTtl
    };

    const response = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.detail || "Operation failed");
      return;
    }

    closeModal();
    if (!editingId) setPage(1);
    loadRecords();
  }

  async function confirmDeleteRecord() {
    if (!token || !recordToDelete) return;

    const response = await fetch(
      `http://127.0.0.1:8000/records/${recordToDelete.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      setRecordToDelete(null);
      loadRecords();
    }
  }

  function startEdit(record: DNSRecord) {
    setEditingId(record.id);
    setFormName(record.name);
    setFormType(record.type);
    setFormValue(record.value);
    setFormTtl(record.ttl);
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setEditingId(null);
    setFormName(zone?.name ? `${zone.name}` : "");
    setFormType("A");
    setFormValue("");
    setFormTtl(300);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (!zone) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-aws-primary)]"></div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs items={[
        { label: "Hosted zones", href: "/hosted-zones" },
        { label: zone.name }
      ]} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-aws-text)] mb-2">{zone.name}</h1>
        <div className="bg-white border border-[var(--color-aws-border)] rounded-sm p-4 text-sm text-[var(--color-aws-text)] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[var(--color-aws-text-muted)] font-medium block mb-1">Description</span>
              {zone.description || "-"}
            </div>
            <div>
              <span className="text-[var(--color-aws-text-muted)] font-medium block mb-1">Hosted zone ID</span>
              <span className="font-mono">{zone.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 mt-8">
        <h2 className="text-xl font-bold text-[var(--color-aws-text)]">Records</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={loadRecords} aria-label="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Create record
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[var(--color-aws-border)] rounded-sm shadow-sm mb-6">
        <div className="p-4 border-b border-[var(--color-aws-border)] flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-1 gap-2 flex-col sm:flex-row">
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[var(--color-aws-text-muted)]" />
              </div>
              <Input
                type="text"
                placeholder="Search records by name"
                className="pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative max-w-[200px] w-full flex items-center">
              <Filter className="h-4 w-4 absolute left-3 text-[var(--color-aws-text-muted)]" />
              <select
                className="flex h-9 w-full rounded-sm border border-[var(--color-aws-secondary-border)] bg-white pl-10 pr-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-aws-link)]"
                value={recordType}
                onChange={(e) => {
                  setRecordType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Types</option>
                {RECORD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-[var(--color-aws-text-muted)] flex items-center shrink-0">
            {total} {total === 1 ? 'record' : 'records'}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value/Route traffic to</TableHead>
              <TableHead>TTL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-aws-primary)]"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-[var(--color-aws-text-muted)]">
                  {search || recordType ? "No records match your filters." : "This hosted zone has no records."}
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-[var(--color-aws-text)] break-all max-w-[250px]">
                    {record.name}
                  </TableCell>
                  <TableCell>
                    <Badge>{record.type}</Badge>
                  </TableCell>
                  <TableCell className="text-[var(--color-aws-text)] break-all max-w-[350px]">
                    {record.value}
                  </TableCell>
                  <TableCell className="text-[var(--color-aws-text-muted)]">
                    {record.ttl}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(record)}>
                        <Edit2 className="h-4 w-4 text-[var(--color-aws-text-muted)]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setRecordToDelete(record)}>
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
        title={editingId ? "Edit Record" : "Create Record"}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveRecord} disabled={!formName || !formValue || !formTtl}>
              {editingId ? "Save changes" : "Create record"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-aws-text)]">
              Record name <span className="text-[var(--color-aws-danger)]">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={`www.${zone.name}`}
              />
            </div>
            <p className="text-xs text-[var(--color-aws-text-muted)]">
              Enter the name for the record.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-aws-text)]">
                Record type <span className="text-[var(--color-aws-danger)]">*</span>
              </label>
              <select
                className="flex h-9 w-full rounded-sm border border-[var(--color-aws-secondary-border)] bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-aws-link)]"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                {RECORD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-aws-text)]">
                TTL (Seconds) <span className="text-[var(--color-aws-danger)]">*</span>
              </label>
              <Input
                type="number"
                value={formTtl}
                onChange={(e) => setFormTtl(parseInt(e.target.value, 10))}
                min={0}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-aws-text)]">
              Value <span className="text-[var(--color-aws-danger)]">*</span>
            </label>
            <textarea
              className="flex w-full rounded-sm border border-[var(--color-aws-secondary-border)] bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-aws-link)] resize-none"
              rows={4}
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="192.0.2.1"
            />
            <p className="text-xs text-[var(--color-aws-text-muted)]">
              Enter the value based on the selected record type.
            </p>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={confirmDeleteRecord}
        title="Delete Record"
        description={`Are you sure you want to delete the record "${recordToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
