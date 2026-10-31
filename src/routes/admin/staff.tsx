import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Smartphone,
  Shield,
  Search,
  CheckCircle2,
  Lock,
  Plus,
  Key,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface StaffRecord {
  id: string;
  name: string;
  email: string;
  role: 'field_officer' | 'reviewer' | 'project_developer';
  assignedRegion: string;
  deviceFingerprint: string;
  accreditation?: string;
  activeSince: string;
  status: 'ACTIVE' | 'OFFLINE';
}

const STAFF_LIST: StaffRecord[] = [
  {
    id: 'STF-FLD-01',
    name: 'Harpreet Singh',
    email: 'harpreet.field@panjdhara.com',
    role: 'field_officer',
    assignedRegion: 'Ludhiana Central & Jodhan Block',
    deviceFingerprint: 'SM-A528B-IMEI-8492019482',
    activeSince: '2026-02-01',
    status: 'ACTIVE',
  },
  {
    id: 'STF-FLD-02',
    name: 'Jasbinder Singh Dhaliwal',
    email: 'jasbinder.field@panjdhara.com',
    role: 'field_officer',
    assignedRegion: 'Bathinda South (Maur Block)',
    deviceFingerprint: 'SM-M336B-IMEI-1902847192',
    activeSince: '2026-02-15',
    status: 'ACTIVE',
  },
  {
    id: 'STF-DEV-01',
    name: 'Amanpreet Singh',
    email: 'lead.developer@panjdhara.com',
    role: 'project_developer',
    assignedRegion: 'Punjab State Carbon Consortium',
    deviceFingerprint: 'MAC-BOOK-PRO-M3-4920',
    activeSince: '2026-01-10',
    status: 'ACTIVE',
  },
  {
    id: 'STF-REV-01',
    name: 'Dr. Katherine Bell',
    email: 'kbell.audit@carbon-standards.org',
    role: 'reviewer',
    assignedRegion: 'Global Agricultural Methodology Audit',
    deviceFingerprint: 'THINKPAD-X1-HW-8192',
    accreditation: 'ISO 14065 Lead GHG Verifier #GHG-9921',
    activeSince: '2026-02-10',
    status: 'ACTIVE',
  },
];

export function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffRecord[]>(STAFF_LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputId = useId();

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedRegion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operating Staff & Field Inspector Credentials"
        description="Govern field officer device cryptographic fingerprints, regional sector assignments, and third-party ISO 14065 reviewer accreditations."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Field Workforce" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              {staff.length} Credentialed Staff
            </span>
          </div>
        }
      />

      {/* Security Context Banner */}
      <div className="bg-[#102e20] text-[#f5f5e8] p-4 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Smartphone size={20} className="text-[#d6eaa6] shrink-0" />
          <div>
            <span className="font-semibold text-white">Cryptographic Device Fingerprint Binding Active</span>
            <p className="text-[#bacabd] mt-0.5">
              Field evidence photographs must match the registered mobile hardware IMEI hash and EXIF sensor payload to pass automated MRV rule R3.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#dde4d9] flex items-center justify-between">
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-3 text-[#708071]" />
            <input
              id={searchInputId}
              type="text"
              placeholder="Search staff, region, role..."
              value={searchTerm}
              aria-label="Search staff, region, role"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
            />
          </div>
          <span className="text-xs text-[#708071]">Hardware-bound credentials</span>
        </div>

        <div className="divide-y divide-[#dde4d9]">
          {filtered.map((s) => (
            <div key={s.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#f9faf7]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#193b2a]">{s.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      s.role === 'reviewer'
                        ? 'bg-purple-100 text-purple-800'
                        : s.role === 'field_officer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.role.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    {s.status}
                  </span>
                </div>
                <div className="text-xs text-[#708071] mt-1">
                  Email: {s.email} · Region: <strong className="text-[#193b2a]">{s.assignedRegion}</strong>
                </div>
                {s.accreditation && (
                  <div className="text-[11px] font-mono text-[#5c7c46] mt-0.5">
                    Accreditation: {s.accreditation}
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-[11px] font-mono text-[#708071]">
                  Hardware Fingerprint:
                </div>
                <div className="font-mono text-xs text-[#193b2a] font-semibold">
                  {s.deviceFingerprint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/staff')({
  head: () =>
    pageHead(
      'Operating Staff | The Carbon Credit OS Admin',
      'Manage field officers, third-party reviewers, and device cryptographic bindings.',
      '/admin/staff'
    ),
  component: AdminStaffPage,
});
