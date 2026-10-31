import { describe, it, expect } from "vitest";
import {
  hasPermission,
  canAccessWorkspace,
  canAccessWorkspaceRoute,
  ROLE_PERMISSIONS,
} from "./permissions";
import { DEMO_ACCOUNTS } from "./auth-context";

describe("Workspace RBAC and Permissions", () => {
  it("should grant admin all permissions", () => {
    const admin = DEMO_ACCOUNTS.admin;
    expect(canAccessWorkspace(admin)).toBe(true);
    expect(hasPermission(admin, "workspace:view")).toBe(true);
    expect(hasPermission(admin, "workspace:projects:manage")).toBe(true);
    expect(hasPermission(admin, "workspace:evidence:review")).toBe(true);
    expect(hasPermission(admin, "workspace:assessments:approve")).toBe(true);
    expect(canAccessWorkspaceRoute(admin, "command")).toBe(true);
    expect(canAccessWorkspaceRoute(admin, "review")).toBe(true);
  });

  it("should grant project_developer access to projects and fields but not assessment approval", () => {
    const dev = DEMO_ACCOUNTS.project_developer;
    expect(canAccessWorkspace(dev)).toBe(true);
    expect(hasPermission(dev, "workspace:projects:read")).toBe(true);
    expect(hasPermission(dev, "workspace:fields:read")).toBe(true);
    expect(hasPermission(dev, "workspace:assessments:approve")).toBe(false);
  });

  it("should grant field_officer access only to fields, evidence and farmers", () => {
    const officer = DEMO_ACCOUNTS.field_officer;
    expect(canAccessWorkspace(officer)).toBe(true);
    expect(hasPermission(officer, "workspace:fields:read")).toBe(true);
    expect(hasPermission(officer, "workspace:farmers:read")).toBe(true);
    expect(hasPermission(officer, "workspace:projects:manage")).toBe(false);
    expect(hasPermission(officer, "workspace:reports:view")).toBe(false);
  });

  it("should grant reviewer access to review queue, evidence and assessments", () => {
    const reviewer = DEMO_ACCOUNTS.reviewer;
    expect(canAccessWorkspace(reviewer)).toBe(true);
    expect(hasPermission(reviewer, "workspace:evidence:review")).toBe(true);
    expect(hasPermission(reviewer, "workspace:assessments:approve")).toBe(true);
    expect(canAccessWorkspaceRoute(reviewer, "review")).toBe(true);
    expect(canAccessWorkspaceRoute(reviewer, "dossier")).toBe(true);
  });

  it("should deny unauthenticated users access to workspace", () => {
    expect(canAccessWorkspace(null)).toBe(false);
    expect(hasPermission(null, "workspace:view")).toBe(false);
    expect(canAccessWorkspaceRoute(null, "command")).toBe(false);
  });

  it("should deny buyers and farmers access to internal workspace", () => {
    const buyer = DEMO_ACCOUNTS.buyer;
    const farmer = DEMO_ACCOUNTS.farmer;
    expect(canAccessWorkspace(buyer)).toBe(false);
    expect(canAccessWorkspace(farmer)).toBe(false);
  });
});
