import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/shared/page-header';
import { DemoBadge } from '@/components/shared/demo-badge';
import {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  PORTAL_ACCESS,
  PERMISSIONS,
  type UserRole,
  type Permission,
} from '@/lib/auth/roles';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Info, ShieldAlert } from 'lucide-react';
import { pageHead } from '@/lib/earth/content';

export function AdminRolesMatrixPage() {
  const permissionCategories: Record<string, Permission[]> = {
    'Farmer Portal Permissions': PERMISSIONS.filter((p) => p.startsWith('farmer:')) as Permission[],
    'Workspace Operations & MRV': PERMISSIONS.filter((p) => p.startsWith('workspace:')) as Permission[],
    'Buyer Marketplace & Due Diligence': PERMISSIONS.filter((p) => p.startsWith('buyer:')) as Permission[],
    'System Administration & Governance': PERMISSIONS.filter((p) => p.startsWith('admin:')) as Permission[],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Access Control (RBAC) Matrix"
        description="Granular permission mapping across all 6 platform roles and 3 primary application portals."
        actions={
          <div className="flex items-center gap-2">
            <DemoBadge label="Security Architecture" />
            <span className="text-xs font-mono bg-red-950 text-red-200 border border-red-800 px-2.5 py-1 rounded">
              Granular Claims
            </span>
          </div>
        }
      />

      {/* Security Architecture Principle */}
      <div className="bg-[#102e20] text-[#f5f5e8] p-5 rounded-xl border border-[#1b4330] flex items-start gap-3">
        <ShieldAlert size={20} className="text-[#d6eaa6] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <p className="font-semibold text-white">
            Security Principle: Route Guards &ne; Security Boundary
          </p>
          <p className="text-[#bacabd]">
            These permission mappings guide frontend navigation rendering and client-side route protection.
            Every FastAPI backend endpoint independently validates cryptographic JWT claims and database-backed ownership records.
            Privileged roles cannot be self-assigned during login or registration.
          </p>
        </div>
      </div>

      {/* Portal Access Summary */}
      <div className="bg-white border border-[#dde4d9] rounded-xl p-5">
        <h2 className="font-serif text-base text-[#193b2a] font-semibold mb-3">
          Portal Scope by Role
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {USER_ROLES.map((role) => (
            <div key={role} className="p-3 bg-[#f9faf7] border border-[#dde4d9] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#193b2a]">
                  {ROLE_LABELS[role]}
                </span>
                <span className="font-mono text-[10px] text-[#708071]">{role}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {PORTAL_ACCESS[role].map((portal) => (
                  <span
                    key={portal}
                    className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-mono"
                  >
                    /{portal}/*
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Granular Permission Matrix */}
      <div className="space-y-6">
        {Object.entries(permissionCategories).map(([category, perms]) => (
          <div key={category} className="bg-white border border-[#dde4d9] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-[#f9faf7] border-b border-[#dde4d9]">
              <h3 className="font-serif text-sm font-semibold text-[#193b2a]">
                {category} ({perms.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4f7f1] border-b border-[#dde4d9] text-[#708071] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="px-5 py-2.5 w-1/3">Permission Key</th>
                    {USER_ROLES.map((r) => (
                      <th key={r} className="px-3 py-2.5 text-center">
                        {ROLE_LABELS[r].split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dde4d9]">
                  {perms.map((perm) => (
                    <tr key={perm} className="hover:bg-[#f9faf7]">
                      <td className="px-5 py-2.5 font-mono text-[11px] text-[#193b2a]">
                        {perm}
                      </td>
                      {USER_ROLES.map((role) => {
                        const hasPerm = (ROLE_PERMISSIONS[role] as readonly string[]).includes(perm);
                        return (
                          <td key={role} className="px-3 py-2.5 text-center">
                            {hasPerm ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800">
                                <CheckCircle2 size={13} />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-300">
                                &mdash;
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/admin/roles')({
  head: () =>
    pageHead(
      'Role Permissions Matrix | VirsaFlow Admin',
      'Granular role-to-permission mapping and portal access control matrix.',
      '/admin/roles'
    ),
  component: AdminRolesMatrixPage,
});
