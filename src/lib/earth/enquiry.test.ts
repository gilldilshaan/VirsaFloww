import { describe, it, expect } from 'vitest';
import { composeEnquiry, enquiryContextFields } from './enquiry';
const values = { name: 'Test person', email: 'test@example.org', organization: 'Test collective', purpose: 'Pilot program', message: 'Discuss an agricultural monitoring program.', consent: true };
describe('institutional enquiry rules', () => {
  it('addresses the enquiry to the actual The Carbon Credit team', () => { expect(composeEnquiry(values).split('?')[0]).toBe('mailto:contact@thecarboncredit.in'); });
  it('includes every supplied pilot qualification field in the email', () => {
    const context = { role: 'Program owner', partnerCategory: 'Research institution', geography: 'Proposed region', cropPractice: 'Rice practice', scale: '120 fields', availableData: 'Activity logs and observations', timeline: 'Next season' };
    const body = new URL(composeEnquiry({ ...values, context })).searchParams.get('body');
    for (const field of enquiryContextFields) expect(body).toContain(`${field.label}: ${context[field.key]}`);
    expect(body).toContain('Desired outcome: Discuss an agricultural monitoring program.');
  });
  it('allows optional program context to be omitted', () => { expect(() => composeEnquiry(values)).not.toThrow(); });
  it('requires consent before sharing the enquiry', () => { expect(() => composeEnquiry({ ...values, consent: false })).toThrow(); });
  it('rejects an invalid reply address', () => { expect(() => composeEnquiry({ ...values, email: 'invalid' })).toThrow(); });
  it('requires organization and message', () => { expect(() => composeEnquiry({ ...values, organization: '' })).toThrow(); expect(() => composeEnquiry({ ...values, message: '' })).toThrow(); });
});
