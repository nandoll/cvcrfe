// src/types/cv.types.ts
// Tipos de datos para la información del CV

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
  category: "frontend" | "backend" | "devops" | "tools";
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string | "Present";
  location: string;
  remote: boolean;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | "Present";
}

export interface CVData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  languages: Array<{ name: string; level: string }>;
  softSkills: string[];
}
