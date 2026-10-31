export function evidenceStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'pending':
      return 'Pending Review';
    case 'flagged':
      return 'Flagged';
    default:
      return 'Submitted';
  }
}
