import { createFileRoute } from '@tanstack/react-router';
import { BuyerEnquiryForm } from '@/components/buyers/buyer-enquiry-form';
import { pageHead } from '@/lib/earth/content';

export const Route = createFileRoute('/buyers/enquiry')({
  validateSearch: (search: Record<string, unknown>) => ({
    projectId: (search['projectId'] as string) || undefined,
  }),
  head: () =>
    pageHead(
      'Request Due Diligence | TerraLedger AI',
      'Request data room access and submit due diligence enquiries for agricultural carbon projects.',
      '/buyers/enquiry'
    ),
  component: function BuyerEnquiryRoute() {
    const { projectId } = Route.useSearch();
    return <BuyerEnquiryForm initialProjectId={projectId} />;
  },
});
