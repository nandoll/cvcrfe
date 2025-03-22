// src/components/common/SEO.tsx
import Head from "next/head";
import { useRouter } from "next/router";

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
  title = "Fernando Antezana - CV",
  description = "Currículum profesional de Fernando Antezana, Desarrollador Frontend Senior",
  keywords = "desarrollador frontend, desarrollador web, react, typescript, next.js",
  ogImage = "/assets/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  noIndex = false,
}) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const { locale } = router;

  // Determinar la URL canónica final
  const siteUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://fernandoantezana.com";
  const fullCanonicalUrl = canonicalUrl || `${siteUrl}${currentPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph/Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Canonical Link */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Alternate language versions */}
      <link
        rel="alternate"
        href={`${siteUrl}${currentPath.replace(/^\/(es|en)/, "/es")}`}
        hrefLang="es"
      />
      <link
        rel="alternate"
        href={`${siteUrl}${currentPath.replace(/^\/(es|en)/, "/en")}`}
        hrefLang="en"
      />

      {/* Robots control */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
    </Head>
  );
};
