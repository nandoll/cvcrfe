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
      const response = await fetch(`${this.apiBaseUrl}/cv/${lang}`);

      if (!response.ok) {
        throw new Error("Failed to fetch CV data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching CV data:", error);
      // Fallback a datos locales en caso de error
      return this.getLocalCVData(lang);
    }
  }

  async trackVisit(source?: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
        }),
      });
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  }

  // Método privado para datos fallback (Principio de Responsabilidad Única)
  private getLocalCVData(lang: string): CVData {
    // Datos de fallback en español o inglés
    return lang === "es" ? spanishData : englishData;
  }
}

// Datos de fallback - solo como ejemplo
const spanishData: CVData = {
  name: "Fernando Antezana",
  title: "Desarrollador Frontend Senior",
  summary: "Desarrollador Frontend con más de 5 años de experiencia...",
  // Resto de datos en español
} as CVData;

const englishData: CVData = {
  name: "Fernando Antezana",
  title: "Senior Frontend Developer",
  summary: "Frontend Developer with over 5 years of experience...",
  // Resto de datos en inglés
} as CVData;

// Singleton para el servicio (Patrón Singleton)
export const cvService = new CVService();
