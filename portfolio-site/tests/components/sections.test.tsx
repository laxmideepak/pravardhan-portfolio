import { HeroSection } from "@/components/sections/HeroSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { resumeData } from "@/data/resume";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/LocalDetails", () => ({
  LocalDetails: () => <div>Local details</div>,
}));

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

describe("portfolio sections", () => {
  it("renders hero with exact contact details", () => {
    render(
      <HeroSection
        name={resumeData.name}
        role={resumeData.role}
        tagline={resumeData.tagline}
        contact={resumeData.contact}
      />,
    );

    expect(screen.getByRole("heading", { name: resumeData.name })).toBeInTheDocument();
    expect(screen.getByText(resumeData.contact.email)).toBeInTheDocument();
    expect(screen.getByText(resumeData.contact.phone)).toBeInTheDocument();
  });

  it("renders all experience entries and date ranges", () => {
    render(<ExperienceSection experience={resumeData.experience} />);

    for (const item of resumeData.experience) {
      expect(screen.getByRole("heading", { name: item.role })).toBeInTheDocument();
      expect(screen.getByText(item.period)).toBeInTheDocument();
    }
  });

  it("renders main navigation anchors", () => {
    render(<SiteHeader name={resumeData.name} />);

    const mainNav = screen.getByRole("navigation", { name: "Main" });
    expect(mainNav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "#experience");
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "#skills");
    expect(screen.getByRole("link", { name: "Education" })).toHaveAttribute("href", "#education");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  });
});
