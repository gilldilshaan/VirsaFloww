import { ReactNode, useEffect } from 'react';
import { useRouter, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth/auth-context';
import { Permission, PortalType } from '@/lib/auth/types';
import { LoadingState, UnauthorizedState } from '@/components/terra-ledger/shared/status-states';
import { sanitizeRedirectPath } from '@/lib/auth/redirect';

interface ProtectedRouteProps {
  children: ReactNode;
  portal?: PortalType;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
}

export function ProtectedRoute({
  children,
  portal,
  requiredPermission,
  requiredPermissions,
}: ProtectedRouteProps) {
  const router = useRouter();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, canAccessPortal, hasPermission } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const sanitizedNext = sanitizeRedirectPath(location.pathname, '/');
      const nextTarget = encodeURIComponent(sanitizedNext);
      router.navigate({ to: '/login', search: { next: nextTarget } });
    }
  }, [isLoading, isAuthenticated, location.pathname, router]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12">
        <LoadingState
          title="Verifying Authorization..."
          message="Validating session credentials and role permissions against security policy."
        />
      </div>
    );
  }

  // Fails closed for unauthenticated requests
  if (!isAuthenticated) {
    return (
      <div className="p-8 max-w-xl mx-auto mt-12">
        <UnauthorizedState
          title="Authentication Required"
          message="You must be signed in with a valid account to access this portal route."
          requiredRole="Authenticated Account"
        />
      </div>
    );
  }

  // Check portal-level access using canonical roles
  if (portal && !canAccessPortal(portal)) {
    const roleDescription =
      portal === 'farmer'
        ? 'Registered Farmer or Administrator'
        : portal === 'workspace'
        ? 'MRV Auditor (Reviewer) / Project Developer / Field Officer'
        : 'Authorized Institutional Buyer';

    return (
      <div className="p-8 max-w-2xl mx-auto mt-12">
        <UnauthorizedState
          title="Portal Access Restricted"
          message={`Your current role [${user?.role}] is not authorized to access the ${portal.toUpperCase()} portal.`}
          requiredRole={roleDescription}
        />
      </div>
    );
  }

  // Check granular required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12">
        <UnauthorizedState
          title="Permission Denied"
          message={`Your account lacks the granular permission [${requiredPermission}] required to view or execute this action.`}
          requiredRole="Authorized Privileged Role"
        />
      </div>
    );
  }

  // Check all required permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const missing = requiredPermissions.filter((p) => !hasPermission(p));
    if (missing.length > 0) {
      return (
        <div className="p-8 max-w-2xl mx-auto mt-12">
          <UnauthorizedState
            title="Permissions Denied"
            message={`Missing required permissions: ${missing.join(', ')}.`}
            requiredRole="Authorized Privileged Role"
          />
        </div>
      );
    }
  }

  return <>{children}</>;
}
