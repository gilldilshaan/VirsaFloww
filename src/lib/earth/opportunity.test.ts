import { describe, expect, it } from 'vitest';
import { estimate, totals, validateInputs, type Inputs } from './opportunity';

const base: Inputs = { acres: 9, state: 'Punjab', district: 'Faridkot', crop: 'wheat-paddy', practices: ['awd'], status: 'planned' };
const get = (i: Inputs, id: string) => estimate(i).find(r => r.id === id)!;

describe('opportunity estimator', () => {
  it('carbon uses scenario defaults from land area alone: 9 × 1.2 × 1600 × 80% = 13,824', () => {
    expect(get(base, 'carbon').amount).toBeCloseTo(13824);
  });
  it('wheat-only uses 0.65 credits per acre', () => {
    expect(get({ ...base, crop: 'wheat' }, 'carbon').amount).toBeCloseTo(9 * 0.65 * 1600 * 0.8);
  });
  it('farmer-entered share overrides the default', () => {
    expect(get({ ...base, carbon: { farmerSharePct: 50 } }, 'carbon').amount).toBeCloseTo(8640);
  });
  it('other crops stay not estimable without credits per acre', () => {
    expect(get({ ...base, crop: 'other' }, 'carbon').amount).toBeNull();
  });
  it('carbon hypothetical: 9 × 1.2 × 1600 × 80% = 13,824', () => {
    expect(get({ ...base, carbon: { eligibleAcres: 9, creditsPerAcre: 1.2, pricePerCredit: 1600, farmerSharePct: 80 } }, 'carbon').amount).toBeCloseTo(13824);
  });
  it('cost change multiplies by seasons in the crop pattern', () => {
    expect(get({ ...base, costs: { currentPerAcre: 10000, plannedPerAcre: 9000 } }, 'costs').amount).toBe(18000);
    expect(get({ ...base, crop: 'paddy', costs: { currentPerAcre: 10000, plannedPerAcre: 9000 } }, 'costs').amount).toBe(9000);
  });
  it('finance saving is principal × rate difference', () => {
    expect(get({ ...base, finance: { principal: 100000, currentRatePct: 12, newRatePct: 8, years: 1 } }, 'finance').amount).toBe(4000);
  });
  it('mandi and schemes are never calculated', () => {
    expect(get(base, 'mandi').amount).toBeNull();
    expect(get(base, 'schemes').amount).toBeNull();
  });
  it('district does not change results', () => {
    const s = { ...base, carbon: { eligibleAcres: 9, creditsPerAcre: 1, pricePerCredit: 1000, farmerSharePct: 50 } };
    expect(get({ ...s, district: 'Karnal' }, 'carbon').amount).toBe(get(s, 'carbon').amount);
  });
  it('totals keep categories separate and exclude schemes', () => {
    const t = totals(estimate({ ...base, carbon: { eligibleAcres: 9, creditsPerAcre: 1.2, pricePerCredit: 1600, farmerSharePct: 80 }, finance: { principal: 100000, currentRatePct: 12, newRatePct: 8, years: 1 } }));
    expect(t.recurringCash).toBeCloseTo(13824);
    expect(t.financingSavings).toBe(4000);
    expect(t.confirmedOneTime).toBe(0);
  });
  it('rejects invalid acreage', () => {
    expect(validateInputs({ ...base, acres: 0 })['acres']).toBeDefined();
    expect(validateInputs({ ...base, acres: -3 })['acres']).toBeDefined();
    expect(validateInputs({ ...base, acres: Number.NaN })['acres']).toBeDefined();
    expect(validateInputs({ ...base, acres: 0.5 })['acres']).toBeUndefined();
  });
  it('eligible acres cannot exceed farm area', () => {
    expect(validateInputs({ ...base, carbon: { eligibleAcres: 12 } })['eligibleAcres']).toBeDefined();
  });
});
