import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Search,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  Shield,
  Layers,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  sha256Hash: string;
  ipAddress: string;
  status: 'VERIFIED' | 'TAMPER_PROOF';
}

const AUDIT_LOGS_DATA: AuditLogEntry[] = [
  {
    id: 'AUD-88291',
    timestamp: '2026-10-31 06:14:22 UTC',
    actor: 'root@panjdhara.com',
    role: 'admin',
    action: 'POLICY_UPDATE',
    resource: 'MRV_RULE_THRESHOLD_PHOTO_BUFFER',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '103.24.18.90',
    status: 'VERIFIED',
  },
  {
    id: 'AUD-88290',
    timestamp: '2026-10-31 05:42:10 UTC',
    actor: 'kbell.audit@carbon-standards.org',
    role: 'reviewer',
    action: 'REVIEW_DECISION_RECORDED',
    resource: 'EVIDENCE_ITEM_EV-004-LOG',
    sha256Hash: '72c3d10526017b8f9e2cf44b581023a968d901764ebaf231a47b19df52c1e847',
    ipAddress: '194.80.22.11',
    status: 'VERIFIED',
  },
  {
    id: 'AUD-88289',
    timestamp: '2026-10-31 04:19:03 UTC',
    actor: 'harpreet.field@panjdhara.com',
    role: 'field_officer',
    action: 'IN_SITU_PHOTO_UPLOAD',
    resource: 'PARCEL_PB-LUD-042_EV-005',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    ipAddress: '49.36.128.4',
    status: 'VERIFIED',
  },
  {
    id: 'AUD-88288',
    timestamp: '2026-10-30 22:10:45 UTC',
    actor: 'lead.developer@panjdhara.com',
    role: 'project_developer',
    action: 'MRV_RULES_EVALUATION',
    resource: 'PROJECT_PRJ-PB-DSR-01',
    sha256Hash: '9f83a21e7d0a2731804b901a1d1297e5591cf8813bcdae34024b423f7178a301',
    ipAddress: '103.24.18.90',
    status: 'VERIFIED',
  },
  {
    id: 'AUD-88287',
    timestamp: '2026-10-30 18:04:12 UTC',
    actor: 'sophia@climateprocurement.com',
    role: 'buyer',
    action: 'DUE_DILIGENCE_INQUIRY_SUBMITTED',
    resource: 'ENQUIRY_DD-INQ-88401',
    sha256Hash: '4f29a0e71b29a8c3d9039bf832da8431c09420bba54320912189dca0298a2873',
    ipAddress: '82.165.197.1',
    status: 'VERIFIED',
  },
  {
    id: 'AUD-88286',
    timestamp: '2026-10-30 14:30:00 UTC',
    actor: 'root@panjdhara.com',
    role: 'admin',
    action: 'DATA_ROOM_PERMIT_GRANTED',
    resource: 'BUYER_BUY-ACC-001',
    sha256Hash: '8a9c394801fe839bcda0192847291a039bfe8912304918237192837491029384',
    ipAddress: '103.24.18.90',
    status: 'VERIFIED',
  },
];

export function AdminAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(AUDIT_LOGS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const searchInputId = useId();
  const actionFilterId = useId();

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tcc_audit_ledger_${Date.now()}.json`;
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
            <option value="all">All Action Types</option>
            <option value="POLICY_UPDATE">POLICY_UPDATE</option>
            <option value="REVIEW_DECISION_RECORDED">REVIEW_DECISION_RECORDED</option>
            <option value="IN_SITU_PHOTO_UPLOAD">IN_SITU_PHOTO_UPLOAD</option>
            <option value="MRV_RULES_EVALUATION">MRV_RULES_EVALUATION</option>
            <option value="DUE_DILIGENCE_INQUIRY_SUBMITTED">DUE_DILIGENCE_INQUIRY_SUBMITTED</option>
            <option value="DATA_ROOM_PERMIT_GRANTED">DATA_ROOM_PERMIT_GRANTED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9faf7] border-b border-[#dde4d9] text-[#708071] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Log Reference</th>
                <th className="px-5 py-3.5">Timestamp (UTC)</th>
                <th className="px-5 py-3.5">Actor & Role</th>
                <th className="px-5 py-3.5">Action Executed</th>
                <th className="px-5 py-3.5">Target Resource</th>
                <th className="px-5 py-3.5">Cryptographic SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde4d9]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#f9faf7] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#193b2a]">
                    {log.id}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#708071]">
                    {log.timestamp}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#193b2a]">{log.actor}</div>
                    <span className="font-mono text-[10px] text-[#5c7c46] uppercase">
                      {log.role} (IP: {log.ipAddress})
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[11px] bg-[#f4f7f1] text-[#193b2a] px-2 py-0.5 rounded font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#213c2b]">
                    {log.resource}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[10px] text-[#708071] truncate max-w-[140px] block" title={log.sha256Hash}>
                      {log.sha256Hash.substring(0, 16)}...
                    </span>
                  </td>
                </tr>
              ))}
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
      'Audit Logs | The Carbon Credit OS Admin',
      'Append-only cryptographic audit trail and platform activity logging.',
      '/admin/audit-logs'
    ),
  component: AdminAuditLogsPage,
});
