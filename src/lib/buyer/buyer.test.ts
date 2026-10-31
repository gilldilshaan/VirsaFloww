import { describe, it, expect } from 'vitest';
import {
  getApprovedBuyerProjects,
  getApprovedBuyerProjectById,
  loadBuyerEnquiries,
  saveBuyerEnquiry,
  DEFAULT_DEMO_BUYER_PROFILE,
} from './buyer-service';
import { canAccessRoute, getPortalFromPath } from '@/lib/auth/permissions';
import { ROLE_PERMISSIONS } from '@/lib/auth/roles';

describe('Buyer Portal Safe Projection & Service', () => {
  it('projects only approved projects with strict truth & privacy constraints', () => {
    const projects = getApprovedBuyerProjects();
    expect(projects.length).toBeGreaterThan(0);

    for (const project of projects) {
      // Must not contain farmer PII (privacy constraint)
      expect((project as any).farmerName).toBeUndefined();
      expect((project as any).farmerNameLocal).toBeUndefined();
      expect((project as any).farmerPhone).toBeUndefined();
      expect((project as any).coordinates).toBeUndefined();
      expect((project as any).boundaryPolygon).toBeUndefined();

      // Must not expose fabricated price per ton
      expect((project as any).indicativePricePerTonUsd).toBeUndefined();

      // Status must never be 'VERIFIED' in sprint build
      expect(project.assessmentStatus).not.toBe('VERIFIED');
      expect(['READY_FOR_VERIFICATION', 'NEEDS_REVIEW', 'UNVERIFIED']).toContain(
        project.assessmentStatus
      );

      // Must provide aggregate metrics
      expect(project.totalHectares).toBeGreaterThan(0);
      expect(project.enrolledParcels).toBeGreaterThan(0);
      expect(project.farmerCount).toBeGreaterThan(0);

      // Evidence depth counts only
      expect(project.evidenceDepth).toBeDefined();
      expect(project.evidenceDepth.satellitePasses).toBeGreaterThanOrEqual(0);
      expect(project.evidenceDepth.groundPhotos).toBeGreaterThanOrEqual(0);
      expect(project.evidenceDepth.waterLogs).toBeGreaterThanOrEqual(0);
    }
  });

  it('retrieves project by id or slug correctly, and returns undefined for unknown id', () => {
    const project = getApprovedBuyerProjectById('PRJ-PB-DSR-01');
    expect(project).toBeDefined();
    expect(project?.title).toContain('Punjab Direct Seeded Rice');

    const projectBySlug = getApprovedBuyerProjectById('punjab-dsr-cluster-1');
    expect(projectBySlug).toBeDefined();
    expect(projectBySlug?.id).toBe('PRJ-PB-DSR-01');

    const unknown = getApprovedBuyerProjectById('NON_EXISTENT_PROJECT');
    expect(unknown).toBeUndefined();
  });

  it('manages buyer enquiries correctly with unique reference IDs and ordering', () => {
    const enquiry1 = saveBuyerEnquiry({
      buyerName: 'Climate Portfolio Director',
      buyerOrg: 'Apex Carbon Fund',
      projectId: 'PRJ-PB-DSR-01',
      projectTitle: 'Punjab Direct Seeded Rice MRV Cluster #1',
      volumeRequestedTons: 5000,
      targetRetirementYear: '2026',
      message: 'Requesting technical data room access.',
    });

    expect(enquiry1.id).toMatch(/^DD-INQ-/);
    expect(enquiry1.stage).toBe('Inquiry');
    expect(enquiry1.status).toBe('Active');
    expect(enquiry1.volumeRequestedTons).toBe(5000);

    const enquiry2 = saveBuyerEnquiry({
      buyerName: 'Sustainability VP',
      buyerOrg: 'Global Tech Corp',
      projectId: 'PRJ-PB-CRM-02',
      projectTitle: 'Malwa Zero-Till & Residue Management Hub',
      volumeRequestedTons: 10000,
      targetRetirementYear: '2027',
      message: 'Requesting soil carbon test logs.',
    });

    const all = loadBuyerEnquiries();
    expect(all[0]?.id).toBe(enquiry2.id); // Latest first
    expect(all.some((e) => e.id === enquiry1.id)).toBe(true);
    expect(all.some((e) => e.id === enquiry2.id)).toBe(true);
  });

  it('maintains default demo buyer profile with institutional defaults', () => {
    expect(DEFAULT_DEMO_BUYER_PROFILE.id).toBe('BUYER-DEMO-001');
    expect(DEFAULT_DEMO_BUYER_PROFILE.organization).toBe('Global Climate Procurement Corp');
    expect(DEFAULT_DEMO_BUYER_PROFILE.email).toContain('@');
    expect(DEFAULT_DEMO_BUYER_PROFILE.sector).toBeDefined();
  });
});

describe('Buyer Portal Role & Route Access Guards', () => {
  it('correctly maps buyer routes to the buyer portal', () => {
    expect(getPortalFromPath('/buyers/marketplace')).toBe('buyers');
    expect(getPortalFromPath('/buyers/projects/PRJ-PB-DSR-01')).toBe('buyers');
    expect(getPortalFromPath('/buyers/enquiry')).toBe('buyers');
    expect(getPortalFromPath('/buyers/enquiries')).toBe('buyers');
    expect(getPortalFromPath('/buyers/profile')).toBe('buyers');
  });

  it('allows buyer role to access all buyer routes', () => {
    expect(canAccessRoute('buyer', '/buyers/marketplace')).toBe(true);
    expect(canAccessRoute('buyer', '/buyers/projects/PRJ-PB-DSR-01')).toBe(true);
    expect(canAccessRoute('buyer', '/buyers/enquiry')).toBe(true);
    expect(canAccessRoute('buyer', '/buyers/enquiries')).toBe(true);
    expect(canAccessRoute('buyer', '/buyers/profile')).toBe(true);
  });

  it('strictly forbids buyer role from accessing workspace and farmer routes', () => {
    expect(canAccessRoute('buyer', '/workspace/command')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/satellite')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/evidence')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/projects')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/fields')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/review')).toBe(false);
    expect(canAccessRoute('buyer', '/workspace/terra-intelligence')).toBe(false);

    expect(canAccessRoute('buyer', '/farmer/fields')).toBe(false);
    expect(canAccessRoute('buyer', '/farmer/evidence')).toBe(false);
    expect(canAccessRoute('buyer', '/farmer/season')).toBe(false);
  });

  it('enforces least-privilege for buyer role permissions', () => {
    const buyerPerms = ROLE_PERMISSIONS['buyer'];
    expect(buyerPerms).toContain('buyer:view_marketplace');
    expect(buyerPerms).toContain('buyer:view_approved_project');
    expect(buyerPerms).toContain('buyer:submit_enquiry');
    expect(buyerPerms).toContain('buyer:view_own_enquiries');
    expect(buyerPerms).toContain('buyer:manage_profile');

    // Must NOT have internal operational permissions
    expect(buyerPerms).not.toContain('workspace:review_evidence');
    expect(buyerPerms).not.toContain('workspace:manage_projects');
    expect(buyerPerms).not.toContain('workspace:manage_fields');
    expect(buyerPerms).not.toContain('workspace:view_farmers');
    expect(buyerPerms).not.toContain('farmer:submit_evidence');
  });
});
