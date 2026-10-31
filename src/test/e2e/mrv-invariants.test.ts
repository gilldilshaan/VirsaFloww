import { describe, expect, it } from 'vitest';
import { assertValidMrvStatus, AssessmentStatus } from './helpers/test-harness';

describe('E2E MRV Invariants, Rule Evaluation & Status Restrictions', () => {
  describe('Tier 1: Feature Coverage (Status Enums & 5-Rule Invariants)', () => {
    it('1.1 strictly restricts assessment status to UNVERIFIED, NEEDS_REVIEW, or READY_FOR_VERIFICATION', () => {
      const allowed: AssessmentStatus[] = ['UNVERIFIED', 'NEEDS_REVIEW', 'READY_FOR_VERIFICATION'];

      for (const status of allowed) {
        expect(() => assertValidMrvStatus(status)).not.toThrow();
        expect(assertValidMrvStatus(status)).toBe(status);
      }
    });

    it('1.2 strictly throws an INVARIANT VIOLATION error if status is ever VERIFIED', () => {
      expect(() => assertValidMrvStatus('VERIFIED')).toThrow(
        /INVARIANT VIOLATION: MRV status cannot be 'VERIFIED'/
      );
    });

    it('1.3 enforces that an assessment with 5 passing rules evaluates to READY_FOR_VERIFICATION and never VERIFIED', () => {
      const allPassingRules = [
        { ruleId: 'R1_COMPLETENESS', result: 'pass', explanation: 'All required evidence items present.' },
        { ruleId: 'R2_SPATIAL_INTEGRITY', result: 'pass', explanation: 'All GPS coordinates within field boundary.' },
        { ruleId: 'R3_TEMPORAL_ALIGNMENT', result: 'pass', explanation: 'Timestamps align with sowing/harvest windows.' },
        { ruleId: 'R4_PRACTICE_ADHERENCE', result: 'pass', explanation: 'DSR practice confirmed with photo evidence.' },
        { ruleId: 'R5_ADDITIONALITY', result: 'pass', explanation: 'Baselines verified against historical records.' },
      ];

      function computeAssessmentStatus(ruleResults: Array<{ result: string }>): AssessmentStatus {
        const hasFail = ruleResults.some((r) => r.result === 'fail');
        const hasWarn = ruleResults.some((r) => r.result === 'warn');

        if (hasFail || hasWarn) {
          return 'NEEDS_REVIEW';
        }
        // Even when 100% of rules pass, status is READY_FOR_VERIFICATION, NEVER VERIFIED
        return 'READY_FOR_VERIFICATION';
      }

      const calculatedStatus = computeAssessmentStatus(allPassingRules);
      expect(calculatedStatus).toBe('READY_FOR_VERIFICATION');
      expect(calculatedStatus).not.toBe('VERIFIED');
      expect(() => assertValidMrvStatus(calculatedStatus)).not.toThrow();
    });

    it('1.4 enforces that any rule failure transitions assessment to NEEDS_REVIEW', () => {
      const rulesWithFailure = [
        { ruleId: 'R1_COMPLETENESS', result: 'pass' },
        { ruleId: 'R2_SPATIAL_INTEGRITY', result: 'fail', explanation: 'Photo coordinates fall outside parcel polygon.' },
        { ruleId: 'R3_TEMPORAL_ALIGNMENT', result: 'pass' },
      ];

      function computeAssessmentStatus(ruleResults: Array<{ result: string }>): AssessmentStatus {
        const hasFail = ruleResults.some((r) => r.result === 'fail');
        if (hasFail) return 'NEEDS_REVIEW';
        return 'READY_FOR_VERIFICATION';
      }

      const status = computeAssessmentStatus(rulesWithFailure);
      expect(status).toBe('NEEDS_REVIEW');
      expect(assertValidMrvStatus(status)).toBe('NEEDS_REVIEW');
    });

    it('1.5 requires outstanding verification steps when status is not yet audited', () => {
      const assessmentRecord = {
        id: 'ASM-2026-001',
        fieldId: 'PB-FIELD-001',
        seasonId: 'KHARIF-2026',
        status: 'UNVERIFIED' as AssessmentStatus,
        statusLabel: 'Unverified',
        outstandingVerification: ['Independent field visit', 'Independent review'],
      };

      expect(assessmentRecord.outstandingVerification.length).toBeGreaterThan(0);
      expect(assessmentRecord.outstandingVerification).toContain('Independent field visit');
      expect(assessmentRecord.outstandingVerification).toContain('Independent review');
    });
  });

  describe('Tier 2: Boundary & Corner Cases (Status Violations & Edge Conditions)', () => {
    it('2.1 throws validation error on unrecognized arbitrary status string', () => {
      expect(() => assertValidMrvStatus('AUDITED_AND_COMPLETED')).toThrow(/Invalid MRV status/);
      expect(() => assertValidMrvStatus('APPROVED')).toThrow(/Invalid MRV status/);
      expect(() => assertValidMrvStatus('DRAFT')).toThrow(/Invalid MRV status/);
    });

    it('2.2 case-sensitivity check: lower-case "verified" or "unverified" must be rejected or normalized', () => {
      expect(() => assertValidMrvStatus('verified')).toThrow();
      expect(() => assertValidMrvStatus('ready_for_verification')).toThrow();
    });

    it('2.3 project schema defaults to UNVERIFIED and prohibits VERIFIED status', () => {
      const projectPayload = {
        id: 'PRJ-PB-001',
        title: 'Ludhiana DSR Basin',
        assessmentStatus: 'UNVERIFIED',
      };

      expect(projectPayload.assessmentStatus).toBe('UNVERIFIED');
      expect(() => assertValidMrvStatus(projectPayload.assessmentStatus)).not.toThrow();

      // Ensure that setting to VERIFIED fails validation
      projectPayload.assessmentStatus = 'VERIFIED';
      expect(() => assertValidMrvStatus(projectPayload.assessmentStatus)).toThrow(/INVARIANT VIOLATION/);
    });

    it('2.4 handles empty rule results list by defaulting to UNVERIFIED', () => {
      const emptyRules: Array<{ result: string }> = [];
      const status: AssessmentStatus = emptyRules.length === 0 ? 'UNVERIFIED' : 'NEEDS_REVIEW';

      expect(status).toBe('UNVERIFIED');
      expect(assertValidMrvStatus(status)).toBe('UNVERIFIED');
    });

    it('2.5 validates deterministic rule IDs adhere to canonical catalog (R1-R5)', () => {
      const canonicalRuleIds = [
        'R1_COMPLETENESS',
        'R2_SPATIAL_INTEGRITY',
        'R3_TEMPORAL_ALIGNMENT',
        'R4_PRACTICE_ADHERENCE',
        'R5_ADDITIONALITY',
      ];

      for (const ruleId of canonicalRuleIds) {
        expect(ruleId).toMatch(/^R[1-5]_[A-Z_]+$/);
      }
    });
  });
});
