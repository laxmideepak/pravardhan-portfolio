import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { LocationWidget } from "@/components/LocationWidget";
import { resumeData } from "@/data/resume";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resumeData.name,
    jobTitle: resumeData.role,
    email: `mailto:${resumeData.contact.email}`,
    telephone: resumeData.contact.phone,
    alumniOf: resumeData.education.map((item) => item.institution),
  };

  return (
    <div className="relative overflow-x-clip">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollProgress />
      <FloatingOrbs />
      <LocationWidget />
      <SiteHeader name={resumeData.name} />
      <main id="main-content" className="relative z-10 pt-14 pb-10 sm:pt-16">
        <HeroSection
          name={resumeData.name}
          contact={resumeData.contact}
        />
        <ExperienceSection experience={resumeData.experience} />
        <SkillsSection skills={resumeData.skills} />
        <EducationSection education={resumeData.education} />
        <ContactSection contact={resumeData.contact} />
      </main>
      <SiteFooter name={resumeData.name} email={resumeData.contact.email} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    </div>
  );
}
