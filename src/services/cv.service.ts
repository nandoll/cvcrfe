// src/services/cv.service.ts
// Servicio para obtener datos del CV (siguiendo patrón Repository)

import { CVData } from "@/types/cv.types";

// Interface para el servicio (Principio de Segregación de Interfaces)
export interface ICVService {
  getCVData(lang: string): Promise<CVData>;
  trackVisit(source?: string): Promise<void>;
}

// Implementación concreta del servicio
export class CVService implements ICVService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  async getCVData(lang: string): Promise<CVData> {
    try {
      // Agregamos cacheo con revalidación
      const response = await fetch(`${this.apiBaseUrl}/cv/${lang}`, {
        next: {
          revalidate: 3600, // Revalidar cada hora
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch CV data: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching CV data:", error);
      // Fallback a datos locales en caso de error
      return this.getLocalCVData(lang);
    }
  }

  async trackVisit(source?: string): Promise<void> {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          referrer: document.referrer || "direct",
          path: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to track visit: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error tracking visit:", error);
      // No reintentamos, simplemente fallamos silenciosamente
    }
  }

  // Método privado para datos fallback (Principio de Responsabilidad Única)
  private getLocalCVData(lang: string): CVData {
    // Datos de fallback en español o inglés
    return lang === "es" ? this.getSpanishData() : this.getEnglishData();
  }

  private getSpanishData(): CVData {
    return {
      name: "Fernando Antezana",
      title: "Desarrollador Frontend Senior",
      summary:
        "Desarrollador Frontend con más de 5 años de experiencia en el desarrollo de aplicaciones web modernas utilizando React, TypeScript y Next.js. Apasionado por crear interfaces de usuario intuitivas y accesibles con un enfoque en el rendimiento y la escalabilidad.",
      contact: {
        email: "contacto@fernandoantezana.com",
        phone: "+34 123 456 789",
      },
      experiences: [
        {
          company: "TechCorp España",
          position: "Desarrollador Frontend Senior",
          startDate: "2021",
          endDate: "Presente",
          location: "Madrid, España",
          remote: true,
          responsibilities: [
            "Desarrollo de aplicaciones web con React, TypeScript y Next.js",
            "Implementación de arquitecturas frontend escalables",
            "Optimización de rendimiento y experiencia de usuario",
          ],
          technologies: [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Redux",
          ],
        },
        {
          company: "WebSolutions",
          position: "Desarrollador Frontend",
          startDate: "2018",
          endDate: "2021",
          location: "Barcelona, España",
          remote: false,
          responsibilities: [
            "Creación de interfaces de usuario responsivas",
            "Integración con APIs RESTful",
            "Colaboración en un equipo ágil",
          ],
          technologies: ["Angular", "JavaScript", "SCSS", "RxJS"],
        },
      ],
      education: [
        {
          institution: "Universidad Politécnica de Madrid",
          degree: "Máster",
          field: "Ingeniería de Software",
          startDate: "2016",
          endDate: "2018",
        },
        {
          institution: "Universidad de Barcelona",
          degree: "Grado",
          field: "Ingeniería Informática",
          startDate: "2012",
          endDate: "2016",
        },
      ],
      skills: [
        { name: "React", level: 5, category: "frontend" },
        { name: "TypeScript", level: 4, category: "frontend" },
        { name: "Next.js", level: 4, category: "frontend" },
        { name: "Node.js", level: 3, category: "backend" },
        { name: "NestJS", level: 3, category: "backend" },
        { name: "Docker", level: 3, category: "devops" },
        { name: "Git", level: 4, category: "tools" },
      ],
      languages: [
        { name: "Español", level: "Nativo" },
        { name: "Inglés", level: "Profesional (C1)" },
        { name: "Francés", level: "Intermedio (B1)" },
      ],
      softSkills: [
        "Trabajo en equipo",
        "Comunicación",
        "Resolución de problemas",
        "Adaptabilidad",
        "Gestión del tiempo",
      ],
    } as CVData;
  }

  private getEnglishData(): CVData {
    return {
      name: "Fernando Antezana",
      title: "Senior Frontend Developer",
      summary:
        "Frontend Developer with over 5 years of experience in developing modern web applications using React, TypeScript, and Next.js. Passionate about creating intuitive and accessible user interfaces with a focus on performance and scalability.",
      contact: {
        email: "contact@fernandoantezana.com",
        phone: "+34 123 456 789",
      },
      experiences: [
        {
          company: "TechCorp Spain",
          position: "Senior Frontend Developer",
          startDate: "2021",
          endDate: "Present",
          location: "Madrid, Spain",
          remote: true,
          responsibilities: [
            "Development of web applications with React, TypeScript, and Next.js",
            "Implementation of scalable frontend architectures",
            "Performance and user experience optimization",
          ],
          technologies: [
            "React",
            "TypeScript",
            "Next.js",
            "Tailwind CSS",
            "Redux",
          ],
        },
        {
          company: "WebSolutions",
          position: "Frontend Developer",
          startDate: "2018",
          endDate: "2021",
          location: "Barcelona, Spain",
          remote: false,
          responsibilities: [
            "Creation of responsive user interfaces",
            "Integration with RESTful APIs",
            "Collaboration in an agile team",
          ],
          technologies: ["Angular", "JavaScript", "SCSS", "RxJS"],
        },
      ],
      education: [
        {
          institution: "Technical University of Madrid",
          degree: "Master's Degree",
          field: "Software Engineering",
          startDate: "2016",
          endDate: "2018",
        },
        {
          institution: "University of Barcelona",
          degree: "Bachelor's Degree",
          field: "Computer Science",
          startDate: "2012",
          endDate: "2016",
        },
      ],
      skills: [
        { name: "React", level: 5, category: "frontend" },
        { name: "TypeScript", level: 4, category: "frontend" },
        { name: "Next.js", level: 4, category: "frontend" },
        { name: "Node.js", level: 3, category: "backend" },
        { name: "NestJS", level: 3, category: "backend" },
        { name: "Docker", level: 3, category: "devops" },
        { name: "Git", level: 4, category: "tools" },
      ],
      languages: [
        { name: "Spanish", level: "Native" },
        { name: "English", level: "Professional (C1)" },
        { name: "French", level: "Intermediate (B1)" },
      ],
      softSkills: [
        "Teamwork",
        "Communication",
        "Problem Solving",
        "Adaptability",
        "Time Management",
      ],
    } as CVData;
  }
}

// Singleton para el servicio (Patrón Singleton)
export const cvService = new CVService();
