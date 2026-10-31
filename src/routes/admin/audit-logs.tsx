import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/client';
import {
  FileText,
  Search,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  Shield,
  Layers,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface AuditEvent {
  eventId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: Record<string, unknown>;
  previousHash: string;
  eventHash: string;
}

export function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditEvent[]>([]);
  const [chainValid, setChainValid] = useState<boolean>(true);
  const [verifiedBy, setVerifiedBy] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const searchInputId = useId();
  const actionFilterId = useId();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const [listRes, verifyRes] = await Promise.all([
        api.get<{ items: AuditEvent[]; total: number }>('/audit?limit=100'),
        api.get<{ valid: boolean; error: string | null; verifiedBy?: string }>('/audit/verify'),
      ]);

      if (listRes.data?.items) {
        setLogs(listRes.data.items);
      }
      if (verifyRes.data) {
        setChainValid(verifyRes.data.valid);
        setVerifiedBy(verifyRes.data.verifiedBy || 'Administrator');
      }
    } catch {
      // Keep existing logs on fetch error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const actionTypes = Array.from(new Set(logs.map((l) => l.action))).filter(Boolean);

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.actorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.eventHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tcc_sha256_audit_ledger_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tamper-Evident Audit Trail Logs"
        description="Append-only cryptographic audit ledger documenting every system modification, role assumption, evidence upload, and reviewer decision."
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchLogs}
              variant="outline"
              size="sm"
              className="text-xs h-7 gap-1 border-[#dde4d9] text-[#193b2a]"
              disabled={isLoading}
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              Verify Chain
            </Button>
            <DemoBadge label="SHA-256 Ledger" />
            <Button
              onClick={exportLedger}
              className="bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Download size={13} />
              Export JSON Ledger
            </Button>
          </div>
        }
      />

      {/* Integrity Verification Card */}
      <div className="bg-[#102e20] text-[#f5f5e8] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {chainValid ? (
              <CheckCircle2 size={18} className="text-[#d6eaa6]" />
            ) : (
              <AlertCircle size={18} className="text-red-400" />
            )}
            <h2 className="font-serif text-lg text-white font-semibold">
              {chainValid
                ? 'Cryptographic Hash-Chain Continuity Verified'
                : 'Ledger Hash Mismatch Detected'}
            </h2>
          </div>
          <p className="text-xs text-[#bacabd] max-w-2xl leading-relaxed">
            Every audit event contains the SHA-256 hash of its predecessor, establishing an immutable cryptographic hash chain rooted in the genesis block (<code className="text-[#d6eaa6] bg-[#1a4230] px-1 py-0.5 rounded font-mono">0000000000000000...</code>).
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-[#d6eaa6] block font-semibold">
            {logs.length} Blocks Linked
          </span>
          <span className="text-[11px] text-[#bacabd]">
            Verified by: {verifiedBy || 'Administrator'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-3 text-[#708071]" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search actor, action, hash, ID..."
            value={searchTerm}
            aria-label="Search actor, action, hash, ID"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor={actionFilterId} className="sr-only">Filter by action type</label>
          <select
            id={actionFilterId}
            value={actionFilter}
            aria-label="Filter by action type"
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Action Types ({actionTypes.length})</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9faf7] border-b border-[#dde4d9] text-[#708071] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Block / Ref</th>
                <th className="px-5 py-3.5">Timestamp (UTC)</th>
                <th className="px-5 py-3.5">Actor Identity</th>
                <th className="px-5 py-3.5">Action Executed</th>
                <th className="px-5 py-3.5">Entity / Target</th>
                <th className="px-5 py-3.5">Previous SHA-256</th>
                <th className="px-5 py-3.5">Event SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde4d9]">
              {filtered.length > 0 ? (
                filtered.map((log) => (
                  <tr key={log.eventId} className="hover:bg-[#f9faf7] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#193b2a]">
                      {log.eventId}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#708071]">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#193b2a]">{log.actorId}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] bg-[#f4f7f1] text-[#193b2a] px-2 py-0.5 rounded font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#213c2b]">
                      {log.entityType}: {log.entityId}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="font-mono text-[10px] text-[#708071] truncate max-w-[100px] block"
                        title={log.previousHash}
                      >
                        {log.previousHash.substring(0, 12)}...
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="font-mono text-[10px] text-emerald-800 font-semibold truncate max-w-[100px] block"
                        title={log.eventHash}
                      >
                        {log.eventHash.substring(0, 12)}...
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#708071]">
                    {isLoading ? 'Loading cryptographic ledger records...' : 'No audit records match your search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/audit-logs')({
  head: () =>
    pageHead(
      'Audit Logs | VirsaFlow Admin',
      'Append-only cryptographic audit trail and platform activity logging.',
      '/admin/audit-logs'
    ),
  component: AdminAuditLogsPage,
});
