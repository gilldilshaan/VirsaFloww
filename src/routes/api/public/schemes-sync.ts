import { createFileRoute } from '@tanstack/react-router';

// Scheduled sync endpoint. The backend sync implementation was excluded
// as part of the frontend-only landing page extraction (see LANDING-PAGES-ONLY.md).
export const Route = createFileRoute('/api/public/schemes-sync')({
  server: {
    handlers: {
      POST: async () => {
        return new Response('Sync not configured on this deployment', { status: 503 });
      },
    },
  },
});
