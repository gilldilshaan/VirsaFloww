import { createFileRoute } from '@tanstack/react-router';
import { BuyerProjectDetail } from '@/components/buyers/buyer-project-detail';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/projects/$projectId')({
  head: () =>
    pageHead(
      'Project Due Diligence Dossier | VirsaFlow Buyers',
      'Institutional due diligence dossier for publication-approved agricultural carbon MRV.',
      '/buyers/projects'
    ),
  component: function BuyerProjectRoute() {
    const { projectId } = Route.useParams();
    return <BuyerProjectDetail projectId={projectId} />;
  },
});
