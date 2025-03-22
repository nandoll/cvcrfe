"use client";

// src/components/common/SEO.tsx
import React from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/Provider";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = "/assets/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
}) => {
  const { locale } = useI18n();
  const pathname = usePathname();

  // Default values
  const defaultTitle = "Fernando Antezana - CV";
  const defaultDescription =
    locale === "es"
      ? "Currículum profesional de Fernando Antezana, Desarrollador Frontend Senior"
      : "Professional resume of Fernando Antezana, Senior Frontend Developer";
  const defaultKeywords =
    locale === "es"
      ? "desarrollador frontend, desarrollador web, react, typescript, next.js"
      : "frontend developer, web developer, react, typescript, next.js";

  // Final values
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;

  // Determine the full canonical URL
  const siteUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fernandoantezana.com";
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}${pathname}`;

  return (
    <Head>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph/Facebook */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Fernando Antezana" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Canonical Link */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Alternate language versions */}
      <link
        rel="alternate"
        href={`${siteUrl}${pathname.replace(/^\/(es|en)/, "/es")}`}
        hrefLang="es"
      />
      <link
        rel="alternate"
        href={`${siteUrl}${pathname.replace(/^\/(es|en)/, "/en")}`}
        hrefLang="en"
      />
      <link rel="alternate" href={fullCanonicalUrl} hrefLang="x-default" />

      {/* Robots control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};
