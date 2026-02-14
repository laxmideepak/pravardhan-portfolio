import { resumeData } from "@/data/resume";
import { describe, expect, it } from "vitest";

describe("resume data", () => {
  it("includes required top-level fields", () => {
    expect(resumeData.name).toBeTruthy();
    expect(resumeData.role).toBeTruthy();
    expect(resumeData.contact.email).toBeTruthy();
    expect(resumeData.contact.phone).toBeTruthy();
    expect(resumeData.experience.length).toBe(3);
    expect(resumeData.skills.length).toBeGreaterThan(0);
    expect(resumeData.education.length).toBeGreaterThan(0);
  });

  it("has non-empty role, company, and period for each experience item", () => {
    for (const item of resumeData.experience) {
      expect(item.role.trim().length).toBeGreaterThan(0);
      expect(item.company.trim().length).toBeGreaterThan(0);
      expect(item.period.trim().length).toBeGreaterThan(0);
      expect(item.highlights.length).toBe(5);
    }
  });
});
