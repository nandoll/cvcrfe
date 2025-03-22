// src/pages/api/track-qr.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// Inicializar Prisma Client
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Solo permitir método POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { qrId, referrer, userAgent } = req.body;

    // Datos de geolocalización desde encabezados
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    let country = "Unknown";
    let city = "Unknown";

    // Si se está ejecutando en producción, intentar obtener datos de geolocalización
    if (process.env.NODE_ENV === "production" && ipAddress) {
      try {
        // Intenta obtener información de geolocalización a partir de la IP
        // Esto podría implementarse usando servicios como ipinfo.io o similar
        const geoResponse = await fetch(
          `https://ipinfo.io/${ipAddress}/json?token=${process.env.IPINFO_TOKEN}`
        );

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country || "Unknown";
          city = geoData.city || "Unknown";
        }
      } catch (geoError) {
        console.error("Error getting geolocation data:", geoError);
      }
    }

    // Extraer información del dispositivo a partir del User-Agent
    let device = "Unknown";
    let browser = "Unknown";

    if (userAgent) {
      // Detectar tipo de dispositivo (muy básico)
      if (userAgent.includes("Mobile")) {
        device = "Mobile";
      } else if (userAgent.includes("Tablet")) {
        device = "Tablet";
      } else {
        device = "Desktop";
      }

      // Detectar navegador (muy básico)
      if (userAgent.includes("Chrome")) {
        browser = "Chrome";
      } else if (userAgent.includes("Firefox")) {
        browser = "Firefox";
      } else if (userAgent.includes("Safari")) {
        browser = "Safari";
      } else if (userAgent.includes("Edge")) {
        browser = "Edge";
      }
    }

    // Registrar en la base de datos
    const visit = await prisma.visit.create({
      data: {
        qrId,
        timestamp: new Date(),
        ipAddress: String(ipAddress),
        country,
        city,
        device,
        browser,
        referrer: referrer || "direct",
        userAgent: userAgent || "unknown",
      },
    });

    return res.status(200).json({
      success: true,
      visitId: visit.id,
    });
  } catch (error) {
    console.error("Error tracking QR scan:", error);
    return res.status(500).json({
      success: false,
      message: "Error tracking QR scan",
    });
  }
}
