// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Lista de idiomas soportados
const locales = ["es", "en"];
const defaultLocale = "es";

// Función para obtener el idioma preferido
function getLocale(request: NextRequest) {
  // Simular el objeto headers de Negotiator usando los headers de NextRequest
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si ya está accediendo a una ruta de idioma
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirigir a la ruta con el idioma por defecto (o el detectado)
  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Excluir rutas que no necesitan ser procesadas
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
