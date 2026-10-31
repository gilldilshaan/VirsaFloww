export type CropPattern = 'wheat-paddy' | 'wheat';

export function estimateIncome(acres: number, climateSmart: boolean, crop: CropPattern) {
  const multiplier = crop === 'wheat' ? 0.65 : 1.2;
  const carbon = acres * multiplier * 1600 * 0.8;
  const market = climateSmart ? acres * 1200 : 0;
  const credit = acres * 800;
  const schemes = 10000;
  const recurring = carbon + market + credit;
  const total = recurring + schemes;

  return {
    carbon,
    market,
    credit,
    schemes,
    recurring,
    total,
  };
}

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
