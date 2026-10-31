import { createFileRoute } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import { Button } from '@/components/ui/button';
import { USER_ROLES, ROLE_LABELS, type UserRole } from '@/lib/auth/roles';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Edit2,
  Trash2,
  Key,
  ShieldAlert,
} from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  mfaEnabled: boolean;
  registeredDate: string;
  lastActive: string;
}

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'USR-ROOT-001',
    name: 'Dilshaan Gill',
    email: 'root@panjdhara.com',
    role: 'admin',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-01-10',
    lastActive: 'Just now',
  },
  {
    id: 'USR-DEV-002',
    name: 'Amanpreet Singh',
    email: 'lead.developer@panjdhara.com',
    role: 'project_developer',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-01-15',
    lastActive: '12 mins ago',
  },
  {
    id: 'USR-FLD-003',
    name: 'Harpreet Singh (Field Officer)',
    email: 'harpreet.field@panjdhara.com',
    role: 'field_officer',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-02-01',
    lastActive: '1 hour ago',
  },
  {
    id: 'USR-REV-004',
    name: 'Dr. Katherine Bell',
    email: 'kbell.audit@carbon-standards.org',
    role: 'reviewer',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-02-10',
    lastActive: '3 hours ago',
  },
  {
    id: 'USR-FAR-005',
    name: 'Gurdev Singh Gill',
    email: 'gurdev.gill@farmer.punjab.in',
    role: 'farmer',
    status: 'ACTIVE',
    mfaEnabled: false,
    registeredDate: '2026-03-01',
    lastActive: '1 day ago',
  },
  {
    id: 'USR-BUY-006',
    name: 'Sophia Lindqvist',
    email: 'sophia@climateprocurement.com',
    role: 'buyer',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-03-15',
    lastActive: '4 hours ago',
  },
  {
    id: 'USR-FAR-007',
    name: 'Jaswant Singh Cheema',
    email: 'jaswant.cheema@farmer.punjab.in',
    role: 'farmer',
    status: 'ACTIVE',
    mfaEnabled: false,
    registeredDate: '2026-03-20',
    lastActive: '3 days ago',
  },
  {
    id: 'USR-BUY-008',
    name: 'Marcus Vance',
    email: 'm.vance@vance-esg.com',
    role: 'buyer',
    status: 'ACTIVE',
    mfaEnabled: true,
    registeredDate: '2026-04-02',
    lastActive: '5 days ago',
  },
];

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('farmer');
  const [editStatus, setEditStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [feedback, setFeedback] = useState<string | null>(null);
  const searchInputId = useId();
  const roleFilterId = useId();

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleOpenEdit = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditStatus(user.status);
    setFeedback(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updated = users.map((u) =>
      u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u
    );

    setUsers(updated);
    setSelectedUser(null);
    setFeedback(`Updated ${selectedUser.name}: Role=${editRole}, Status=${editStatus}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Access Directory & Accounts"
        description="Inspect authenticated accounts, assign system roles, and govern multi-portal authorization states."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="IAM Governance" />
            <span className="text-xs font-mono bg-[#193b2a] text-[#f5f5e8] px-3 py-1.5 rounded">
              {users.length} Managed Accounts
            </span>
          </div>
        }
      />

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-3 text-[#708071]" />
          <input
            id={searchInputId}
            type="text"
            placeholder="Search name, email, or user ID..."
            value={searchTerm}
            aria-label="Search name, email, or user ID"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs focus:outline-none focus:border-[#193b2a]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor={roleFilterId} className="sr-only">Filter by role</label>
          <select
            id={roleFilterId}
            value={roleFilter}
            aria-label="Filter by role"
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#213c2b] focus:outline-none"
          >
            <option value="all">All Roles ({users.length})</option>
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f9faf7] border-b border-[#dde4d9] text-[#708071] font-mono uppercase text-[10px]">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Security / MFA</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Last Active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dde4d9]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#f9faf7] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-[#193b2a]">{u.name}</div>
                    <div className="text-[11px] font-mono text-[#708071]">{u.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-medium ${
                        u.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : u.role === 'reviewer'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'project_developer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.role === 'field_officer'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'buyer'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-lime-100 text-lime-900'
                      }`}
                    >
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.mfaEnabled ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 size={12} />
                        MFA Verified
                      </span>
                    ) : (
                      <span className="text-[#708071] text-[11px]">Password Only</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#708071]">{u.lastActive}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      onClick={() => handleOpenEdit(u)}
                      variant="outline"
                      className="text-xs h-7 px-2.5 text-[#193b2a] border-[#dde4d9] hover:bg-[#f4f7f1]"
                    >
                      <Edit2 size={12} className="mr-1" />
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Configuration Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#dde4d9] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#dde4d9] pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#193b2a]">Modify Account Access</h3>
                <p className="text-xs text-[#708071]">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[#708071] hover:text-[#193b2a] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                  Assigned Security Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#193b2a] font-medium focus:outline-none"
                >
                  {USER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]} ({r})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#708071] mt-1">
                  Enforces route permissions and cryptographic API scope on the server.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#708071] uppercase block mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f4f7f1] border border-[#dde4d9] rounded-lg text-xs text-[#193b2a] font-medium focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Authorized to authenticate)</option>
                  <option value="SUSPENDED">SUSPENDED (Revoke all JWT tokens)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#193b2a] text-[#f5f5e8] hover:bg-[#224e37] text-xs py-2"
                >
                  Save Access Rule
                </Button>
                <Button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  variant="outline"
                  className="text-xs py-2 border-[#dde4d9]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute('/admin/users')({
  head: () =>
    pageHead(
      'User Directory | The Carbon Credit OS Admin',
      'Manage user accounts, credentials, and role assignments across portals.',
      '/admin/users'
    ),
  component: AdminUsersPage,
});
