export interface ContactInfo {
  email: string;
  phone: string;
  resumePath: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
}

export interface ResumeData {
  name: string;
  role: string;
  tagline: string;
  contact: ContactInfo;
  experience: ExperienceItem[];
  skills: SkillCategory[];
  education: EducationItem[];
}
