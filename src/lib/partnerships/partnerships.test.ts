import { describe, it, expect } from 'vitest';
import {
  getPartnershipEnquiries,
  submitPartnershipEnquiry,
  updatePartnershipEnquiryStatus,
} from './partnerships-service';

describe('Industrial Partnerships Service', () => {
  it('retrieves initial institutional partnership enquiries', () => {
    const list = getPartnershipEnquiries();
    expect(list.length).toBeGreaterThan(0);

    const first = list[0]!;
    expect(first.id).toMatch(/^TCC-IND-/);
    expect(first.organisationName).toBeDefined();
    expect(first.status).toBeDefined();
    expect(first.interest).toBeDefined();
  });

  it('submits a new partnership enquiry and assigns reference ID', async () => {
    const res = await submitPartnershipEnquiry({
      organisationName: 'National Thermal Power Infrastructure Corp',
      contactPerson: 'Sandeep Varma',
      email: 's.varma@ntpc.co.in',
      phone: '+91 99100 88221',
      organisationType: 'Infrastructure Company',
      industry: 'Power & Thermal Utilities',
      city: 'New Delhi',
      state: 'Delhi',
      interest: 'Industrial environmental infrastructure',
      estimatedScale: '2 Flue Gas Algae Abatement Pilot Sites',
      message: 'Scoping point-source microalgae bioreactors for thermal power plant effluent treatment and carbon capture.',
      consent: true,
    });

    expect(res.success).toBe(true);
    expect(res.enquiryId).toMatch(/^TCC-IND-\d{5}$/);

    const all = getPartnershipEnquiries();
    const found = all.find((e) => e.id === res.enquiryId);
    expect(found).toBeDefined();
    expect(found?.organisationName).toBe('National Thermal Power Infrastructure Corp');
    expect(found?.status).toBe('New');
  });

  it('updates enquiry status, owner, and appends internal notes', () => {
    const list = getPartnershipEnquiries();
    const item = list[0]!;

    const updated = updatePartnershipEnquiryStatus(
      item.id,
      'Under Negotiation',
      'Lead Project Director',
      'Technical specification sheet shared with engineering team.'
    );

    expect(updated).toBe(true);

    const refreshed = getPartnershipEnquiries();
    const target = refreshed.find((e) => e.id === item.id);
    expect(target?.status).toBe('Under Negotiation');
    expect(target?.assignedOwner).toBe('Lead Project Director');
    expect(target?.internalNotes?.some((n) => n.includes('Technical specification sheet'))).toBe(true);
  });
});
