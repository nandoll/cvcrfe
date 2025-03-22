// src/services/analytics.service.ts
// Servicio para gestionar analíticas

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  avgDuration: number;
  visitsBySource: Array<{ source: string; count: number }>;
  visitsByCountry: Array<{ country: string; count: number }>;
  visitsByDevice: Array<{ device: string; count: number }>;
  visitsByBrowser: Array<{ browser: string; count: number }>;
}

export interface IAnalyticsService {
  getStats(
    startDate: string,
    endDate: string,
    token: string
  ): Promise<AnalyticsData>;
  trackQRScan(qrId: string): Promise<void>;
}

export class AnalyticsService implements IAnalyticsService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  async getStats(
    startDate: string,
    endDate: string,
    token: string
  ): Promise<AnalyticsData> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/analytics/stats?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      // Fallback a datos de ejemplo en caso de error
      return this.getMockAnalyticsData();
    }
  }

  async trackQRScan(qrId: string): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/analytics/qr-scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
        }),
      });
    } catch (error) {
      console.error("Error tracking QR scan:", error);
    }
  }

  async getCampaignPerformance(
    campaignId: string,
    token: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/analytics/campaigns/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch campaign data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      return null;
    }
  }

  // Datos de ejemplo para fallback
  private getMockAnalyticsData(): AnalyticsData {
    return {
      totalVisits: 1250,
      uniqueVisitors: 875,
      avgDuration: 195, // segundos
      visitsBySource: [
        { source: "direct", count: 450 },
        { source: "linkedin", count: 350 },
        { source: "github", count: 200 },
        { source: "qr-code", count: 150 },
        { source: "other", count: 100 },
      ],
      visitsByCountry: [
        { country: "Spain", count: 400 },
        { country: "United States", count: 300 },
        { country: "Germany", count: 200 },
        { country: "Mexico", count: 150 },
        { country: "Other", count: 200 },
      ],
      visitsByDevice: [
        { device: "Desktop", count: 750 },
        { device: "Mobile", count: 400 },
        { device: "Tablet", count: 100 },
      ],
      visitsByBrowser: [
        { browser: "Chrome", count: 600 },
        { browser: "Firefox", count: 250 },
        { browser: "Safari", count: 250 },
        { browser: "Edge", count: 100 },
        { browser: "Other", count: 50 },
      ],
    };
  }
}

// Singleton para el servicio
export const analyticsService = new AnalyticsService();
