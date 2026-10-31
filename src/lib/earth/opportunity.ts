/**
 * Agricultural Opportunity Estimator — pure, browser-safe calculation engine.
 * No financial default is assumed: every number comes from the user or from a
 * reviewed entry in the assumption registry. Unvalidated categories return
 * "not_estimable" with the inputs that are missing.
 */

export const ACRES_MIN = 0.1;
export const ACRES_MAX = 500;
export const MODEL_VERSION = '2026.10-a';
export const MODEL_REVIEWED = '2026-10-09';

export const cropPatterns = {
  'wheat-paddy': { label: 'Wheat + paddy', seasons: ['Rabi wheat', 'Kharif paddy'] },
  'paddy': { label: 'Paddy only', seasons: ['Kharif paddy'] },
  'wheat': { label: 'Wheat only', seasons: ['Rabi wheat'] },
  'other': { label: 'Other / mixed crops', seasons: [] as string[] },
} as const;
/** Scenario defaults from The Carbon Credit's original model — labelled "assumed" and editable; not validated. */
export const scenarioDefaults = { creditsPerAcre: { 'wheat-paddy': 1.2, paddy: 1.2, wheat: 0.65, other: null } as Record<string, number | null>, pricePerCredit: 1600, farmerSharePct: 80 };
export type CropPattern = keyof typeof cropPatterns;

export const practices = {
  dsr: { label: 'Direct Seeded Rice (DSR)', plain: 'Sowing rice seed directly instead of transplanting seedlings into flooded, puddled soil.', ricePractice: true },
  awd: { label: 'Alternate Wetting and Drying (AWD)', plain: 'Letting paddy fields dry partly between irrigations instead of keeping them flooded all season.', ricePractice: true },
  'zero-till': { label: 'Zero tillage', plain: 'Sowing the next crop without ploughing, often into the previous crop’s residue.', ricePractice: false },
  residue: { label: 'Residue or straw management', plain: 'Handling straw without burning — for example mulching, incorporation or removal.', ricePractice: false },
  other: { label: 'Other eligible practices', plain: 'Another practice you or your FPO are considering.', ricePractice: false },
  undecided: { label: 'Not decided yet', plain: 'You would like help understanding which practices could suit your farm.', ricePractice: false },
} as const;
export type Practice = keyof typeof practices;

/** Geography is used for pilot matching only — no district has validated parameters yet. */
export const geography: { state: string; districts: string[] }[] = [
  { state: 'Punjab', districts: ['Faridkot', 'Bathinda', 'Ferozepur', 'Ludhiana', 'Moga', 'Sangrur'] },
  { state: 'Haryana', districts: ['Karnal', 'Kaithal', 'Kurukshetra'] },
  { state: 'Other / not listed', districts: [] },
];
export const validatedDistrictParameters: Record<string, never> = {};

export type Status = 'potential' | 'not_estimable' | 'eligibility_unassessed';
export type Kind = 'potential_revenue' | 'operating_savings' | 'financing_savings' | 'one_time_support' | 'not_estimable';
export type Source = 'user-provided' | 'assumed' | 'sourced' | 'measured';

export interface Line { label: string; value: string; unit: string; source: Source }
export interface Opportunity {
  id: 'carbon' | 'costs' | 'mandi' | 'finance' | 'schemes';
  title: string; kind: Kind; status: Status; period: 'annual' | 'one-time' | 'per season';
  amount: number | null; formula: string; inputs: Line[]; missing: string[]; conditions: string[]; verifyNeeds: string[];
}

export interface Inputs {
  acres: number; state: string; district: string; crop: CropPattern; practices: Practice[]; status: 'planned' | 'implemented';
  /** Hypothetical carbon scenario — only used when the user enters every value. */
  carbon?: { eligibleAcres?: number; creditsPerAcre?: number; pricePerCredit?: number; farmerSharePct?: number };
  /** Per-acre per-season cost comparison entered by the user. */
  costs?: { currentPerAcre?: number; plannedPerAcre?: number };
  /** Loan comparison entered by the user. */
  finance?: { principal?: number; currentRatePct?: number; newRatePct?: number; years?: number };
}

export function validateInputs(i: Partial<Inputs>): Record<string, string> {
  const e: Record<string, string> = {};
  const a = i.acres;
  if (typeof a !== 'number' || !Number.isFinite(a)) e['acres'] = 'Enter your farm area as a number.';
  else if (a < ACRES_MIN) e['acres'] = `Farm area must be at least ${ACRES_MIN} acres.`;
  else if (a > ACRES_MAX) e['acres'] = `Farm area must be ${ACRES_MAX} acres or less.`;
  if (!i.crop || !(i.crop in cropPatterns)) e['crop'] = 'Choose a crop pattern.';
  if (!i.practices || i.practices.length === 0) e['practices'] = 'Choose at least one practice, or “Not decided yet”.';
  const c = i.carbon;
  if (c?.eligibleAcres !== undefined && typeof a === 'number' && c.eligibleAcres > a) e['eligibleAcres'] = 'Eligible area cannot be larger than your farm.';
  if (c?.farmerSharePct !== undefined && (c.farmerSharePct < 0 || c.farmerSharePct > 100)) e['farmerSharePct'] = 'Farmer share must be between 0 and 100%.';
  for (const [k, v] of Object.entries({ ...c, ...i.costs, ...i.finance })) if (v !== undefined && (!Number.isFinite(v) || v < 0)) e[k] = 'Enter a positive number.';
  return e;
}

const round = (n: number) => Math.round(n);
export const inr = (n: number) => `₹${round(n).toLocaleString('en-IN')}`;
const allSet = <T extends object>(o: T | undefined, keys: (keyof T)[]) => !!o && keys.every(k => typeof o[k] === 'number' && Number.isFinite(o[k] as number));

export function estimate(i: Inputs): Opportunity[] {
  const seasons = cropPatterns[i.crop].seasons.length;
  const hasRice = i.crop === 'paddy' || i.crop === 'wheat-paddy';
  const riceSelected = i.practices.some(p => practices[p].ricePractice);

  // A. Carbon — hypothetical scenario only
  const defCredits = scenarioDefaults.creditsPerAcre[i.crop] ?? undefined;
  const src = (v: number | undefined): Source => v === undefined ? 'assumed' : 'user-provided';
  const raw = i.carbon ?? {};
  const c = { eligibleAcres: raw.eligibleAcres ?? i.acres, creditsPerAcre: raw.creditsPerAcre ?? defCredits, pricePerCredit: raw.pricePerCredit ?? scenarioDefaults.pricePerCredit, farmerSharePct: raw.farmerSharePct ?? scenarioDefaults.farmerSharePct };
  const carbonReady = allSet(c, ['eligibleAcres', 'creditsPerAcre', 'pricePerCredit', 'farmerSharePct']);
  const carbonAmount = carbonReady ? c.eligibleAcres * c.creditsPerAcre! * c.pricePerCredit * (c.farmerSharePct / 100) : null;
  const carbon: Opportunity = {
    id: 'carbon', title: 'Potential carbon proceeds', kind: carbonReady ? 'potential_revenue' : 'not_estimable', status: carbonReady ? 'potential' : 'not_estimable', period: 'annual', amount: carbonAmount,
    formula: 'Eligible acres × credits per acre × price per credit × farmer share',
    inputs: carbonReady ? [
      { label: 'Eligible acres', value: String(c.eligibleAcres), unit: 'acres', source: 'user-provided' },
      { label: 'Credits per acre', value: String(c.creditsPerAcre), unit: 'tCO₂e/acre/yr', source: src(raw.creditsPerAcre) },
      { label: 'Price per credit', value: inr(c.pricePerCredit), unit: 'per credit', source: src(raw.pricePerCredit) },
      { label: 'Farmer share', value: `${c.farmerSharePct}%`, unit: 'of net proceeds', source: src(raw.farmerSharePct) },
    ] : [],
    missing: carbonReady ? [] : ['Credits per acre for your crop pattern — enter your own value to explore a scenario'],
    conditions: [!hasRice ? 'Methane methodologies for rice do not apply to your selected crop pattern.' : !riceSelected ? 'No rice water-management practice (DSR or AWD) is selected.' : 'Eligible practice must be implemented and monitored all season.', 'Requires an approved methodology, baseline, independent verification, registry issuance and a buyer.', 'Estimated reductions are not issued credits; issued credits are not sold credits.'],
    verifyNeeds: ['Field boundaries and consent', 'Season-long water-level and practice records', 'Baseline under the chosen methodology', 'Independent verification'],
  };

  // B. Farming cost changes — user comparison
  const k = i.costs;
  const costReady = allSet(k, ['currentPerAcre', 'plannedPerAcre']);
  const seasonsUsed = Math.max(seasons, 1);
  const costAmount = costReady ? (k!.currentPerAcre! - k!.plannedPerAcre!) * i.acres * seasonsUsed : null;
  const costs: Opportunity = {
    id: 'costs', title: 'Potential farming-cost changes', kind: costReady ? 'operating_savings' : 'not_estimable', status: costReady ? 'potential' : 'not_estimable', period: 'annual', amount: costAmount,
    formula: '(Current cost per acre − planned cost per acre) × acres × seasons',
    inputs: costReady ? [
      { label: 'Current cost', value: inr(k!.currentPerAcre!), unit: 'per acre per season', source: 'user-provided' },
      { label: 'Planned cost', value: inr(k!.plannedPerAcre!), unit: 'per acre per season', source: 'user-provided' },
      { label: 'Farm area', value: String(i.acres), unit: 'acres', source: 'user-provided' },
      { label: 'Seasons', value: String(seasonsUsed), unit: 'per year', source: 'user-provided' },
    ] : [],
    missing: costReady ? [] : ['Your current cost per acre (seed, labour, machinery, fuel, irrigation, inputs)', 'Your expected cost per acre with the new practice'],
    conditions: ['A negative value means the planned practice costs more.', 'Yield changes are not included.', 'No practice lowers costs on every farm.'],
    verifyNeeds: ['Cost records for the current practice', 'Comparable records after the change'],
  };

  // C. Mandi — not estimated (no documented basis)
  const mandi: Opportunity = { id: 'mandi', title: 'Potential market or mandi benefits', kind: 'not_estimable', status: 'not_estimable', period: 'per season', amount: null, formula: 'Not calculated', inputs: [], missing: ['Documented comparison price for your crop, market and quality'], conditions: ['Mandi prices, quality, yield and buyer arrangements vary.'], verifyNeeds: ['Market evidence and a defined comparison'] };

  // D. Finance — user-supplied loan terms
  const f = i.finance;
  const finReady = allSet(f, ['principal', 'currentRatePct', 'newRatePct', 'years']);
  const finAmount = finReady ? f!.principal! * ((f!.currentRatePct! - f!.newRatePct!) / 100) : null;
  const finance: Opportunity = {
    id: 'finance', title: 'Financing and interest savings', kind: finReady ? 'financing_savings' : 'not_estimable', status: finReady ? 'potential' : 'not_estimable', period: 'annual', amount: finAmount,
    formula: 'Loan principal × (current rate − new rate), simple annual interest',
    inputs: finReady ? [
      { label: 'Principal', value: inr(f!.principal!), unit: '', source: 'user-provided' },
      { label: 'Current rate', value: `${f!.currentRatePct}%`, unit: 'per year', source: 'user-provided' },
      { label: 'New rate', value: `${f!.newRatePct}%`, unit: 'per year', source: 'user-provided' },
      { label: 'Tenure', value: String(f!.years), unit: 'years', source: 'user-provided' },
    ] : [],
    missing: finReady ? [] : ['Loan amount, current rate, offered rate and tenure'],
    conditions: ['Avoided interest is a cost saving, not extra income.', 'Assumes the loan is approved on those terms.'],
    verifyNeeds: ['Current loan statement', 'Written offer of new terms'],
  };

  // E. Schemes — never calculated
  const schemes: Opportunity = { id: 'schemes', title: 'Government schemes and grants', kind: 'one_time_support', status: 'eligibility_unassessed', period: 'one-time', amount: null, formula: 'Not calculated', inputs: [], missing: ['Named scheme, administering authority and current eligibility rules'], conditions: ['Scheme support is never added to recurring income.', 'No entitlement is implied until approval is confirmed.'], verifyNeeds: ['Official scheme source', 'Eligibility documents', 'Application and approval record'] };

  return [carbon, costs, mandi, finance, schemes];
}

/** Separate totals only — never one combined “income” figure. Unconfirmed schemes are excluded. */
export function totals(results: Opportunity[]) {
  const sum = (kind: Kind) => results.filter(r => r.kind === kind && r.amount !== null).reduce((s, r) => s + r.amount!, 0);
  return { recurringCash: sum('potential_revenue'), operatingSavings: sum('operating_savings'), financingSavings: sum('financing_savings'), confirmedOneTime: 0 };
}

export const assumptionRegistry = [
  ['Carbon potential per acre', 'Applicable methodology and defensible baseline/project assumptions', 'Not validated'],
  ['Credit sale price', 'Source, date, currency and gross vs net', 'Not validated'],
  ['Farmer revenue share', 'Documented project terms and deductions', 'Not validated'],
  ['Practice cost difference', 'Comparable farm-level cost data', 'User-provided only'],
  ['Mandi advantage', 'Market evidence and a defined comparison', 'Not validated'],
  ['Financing savings', 'Actual loan terms and a defined counterfactual', 'User-provided only'],
  ['Scheme support', 'Named scheme, current eligibility and official source', 'Not validated'],
] as const;
