// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Inicializar Prisma Client (reutilizando la instancia en desarrollo)
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// Validación simple de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    // Validación básica
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required and must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid email is required",
        },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message is required and must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    // Datos adicionales para rastreo
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.ip || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "direct";

    // Almacenar en base de datos
    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
        timestamp: new Date(),
        ipAddress: String(ipAddress),
        userAgent,
        referrer,
        status: "PENDING", // Estado inicial
      },
    });

    // Intentar enviar email (si configurado)
    let emailSent = false;
    if (process.env.EMAIL_ENABLED === "true") {
      try {
        // Aquí iría la integración con tu servicio de email preferido
        // (SendGrid, Mailgun, AWS SES, etc.)

        // Ejemplo con un servicio hipotético:
        /*
        const emailService = new EmailService({
          apiKey: process.env.EMAIL_API_KEY
        });

        await emailService.send({
          to: process.env.CONTACT_EMAIL,
          from: 'noreply@fernandoantezana.com',
          subject: `Nuevo mensaje de contacto de ${name}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
            <hr>
            <p><em>Recibido el ${new Date().toLocaleString()}</em></p>
          `
        });
        */

        // Marcar email como enviado
        await prisma.contactMessage.update({
          where: { id: contact.id },
          data: { status: "SENT" },
        });

        emailSent = true;
      } catch (emailError) {
        console.error("Error sending email:", emailError);

        // Marcar como error al enviar
        await prisma.contactMessage.update({
          where: { id: contact.id },
          data: { status: "ERROR" },
        });
      }
    }

    return NextResponse.json({
      success: true,
      messageId: contact.id,
      emailSent,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error processing contact form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
