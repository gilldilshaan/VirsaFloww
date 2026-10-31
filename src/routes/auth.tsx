import { createFileRoute, redirect } from '@tanstack/react-router';
import { sanitizeRedirectPath } from '@/lib/auth/redirect';

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawNext = search['next'];
    const next = sanitizeRedirectPath(rawNext, '/dashboard');
    return { next };
  },
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/login',
      search: { next: search.next },
    });
  },
  component: () => null,
});
