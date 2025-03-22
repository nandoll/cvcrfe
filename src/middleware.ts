// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { defaultLocale, locales, getLocalePartsFrom } from "./i18n/config";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Omitir rutas estáticas, API y internamente usadas por Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("/static/") ||
    pathname.includes(".") // archivos estáticos
  ) {
    return NextResponse.next();
  }

  // Verificar si la URL ya tiene un locale válido
  const { locale, pathname: pathnameWithoutLocale } =
    getLocalePartsFrom(pathname);

  if (locale) {
    // Si el locale ya está en la URL, no hacer nada
    return NextResponse.next();
  }

  // Determinar el locale preferido del usuario
  const locale2 = getLocale(request);

  // Redirigir a la URL con locale
  return NextResponse.redirect(new URL(`/${locale2}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
