import { useEffect } from "react";

const SITE_URL = "https://farizjr.vercel.app";
const SITE_NAME = "Fariz Jelang Ramadhan";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph.jpg`;
const TWITTER_HANDLE = "@farizjr";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(property: string, content: string, attr: "name" | "property" = "property") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMeta(property: string, attr: "name" | "property" = "property") {
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (el) el.remove();
}

function setJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.querySelector(`script[data-seo="${id}"]`)?.remove();
}

export default function SEO({
  title,
  description = "Portfolio personal Fariz Jelang Ramadhan — Akuntan & Full-Stack Developer yang membangun solusi teknologi berbasis data.",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedAt,
  updatedAt,
  author = SITE_NAME,
  tags = [],
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Portfolio`;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  useEffect(() => {
    document.title = fullTitle;

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Basic
    setMeta("description", description, "name");

    // Open Graph
    setMeta("og:type", type);
    setMeta("og:site_name", SITE_NAME);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:image", imageUrl);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("og:url", canonicalUrl);

    // Article-specific OG
    if (type === "article") {
      if (publishedAt) setMeta("article:published_time", publishedAt);
      if (updatedAt) setMeta("article:modified_time", updatedAt);
      setMeta("article:author", author);
      tags.forEach((tag, i) => setMeta(`article:tag:${i}`, tag));
    } else {
      removeMeta("article:published_time");
      removeMeta("article:modified_time");
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:site", TWITTER_HANDLE, "name");
    setMeta("twitter:creator", TWITTER_HANDLE, "name");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", imageUrl, "name");

    // Robots
    if (noIndex) {
      setMeta("robots", "noindex, nofollow", "name");
    } else {
      setMeta("robots", "index, follow", "name");
    }

    // JSON-LD
    if (jsonLd) {
      setJsonLd("page", jsonLd);
    } else {
      removeJsonLd("page");
    }

    return () => {
      removeJsonLd("page");
    };
  }, [fullTitle, description, imageUrl, canonicalUrl, type, publishedAt, updatedAt, author, noIndex, jsonLd]);

  return null;
}
