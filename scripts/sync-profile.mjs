import { writeFile } from "node:fs/promises";
import { marked } from "marked";

const README_URL =
  "https://raw.githubusercontent.com/ysskrishna/ysskrishna/main/README.md";
const OUTPUT_PATH = "index.html";
const SITE_URL = "https://ysskrishna.github.io/";
const PROFILE = {
  name: "Y. Siva Sai Krishna",
  username: "ysskrishna",
  bio: "I build AI-powered applications and robust backend systems that power modern web experiences. With deep expertise in AI/ML integration, Python (FastAPI, Flask), Node.js, and cloud infrastructure, I architect intelligent solutions that combine cutting-edge AI capabilities with scalable engineering.",
  image: "https://ysskrishna-assets.vercel.app/ysskrishna.webp",
  /** Shown on social previews; keep in sync with the hero/OG image meaning. */
  imageAlt: "Y. Siva Sai Krishna portfolio preview image",
  favicon: "https://ysskrishna.vercel.app/favicon.ico",
  appleTouchIcon: "https://ysskrishna.vercel.app/logo.png",
  themeColorLight: "#f4f6fb",
  themeColorDark: "#0b0d12",
  /** Google Search Console property token for ysskrishna.github.io; leave empty to omit. */
  googleSiteVerification: "3Uju8-r5MKD3qHVptGKrNERow3jCsLWpIOYGgMut3yI",
  email: "sivasaikrishnassk@gmail.com",
  website: "https://ysskrishna.vercel.app/",
  /** Shown at the top of the generated page (GitHub Pages index). */
  cta: {
    portfolio: {
      label: "Portfolio",
      href: "https://ysskrishna.vercel.app/"
    },
    github: {
      label: "GitHub",
      href: "https://github.com/ysskrishna"
    }
  },
  /** Page chrome: accent is the primary brand color (buttons, links, focus). */
  theme: {
    accent: "#5b5bd6",
    accentHover: "#4545c4",
    accentGlow: "rgba(91, 91, 214, 0.22)"
  },
  location: "Bengaluru, India",
  sameAs: [
    "https://github.com/ysskrishna",
    "https://linkedin.com/in/ysskrishna",
    "https://www.producthunt.com/@ysskrishna",
    "https://www.youtube.com/@ysskrishna",
    "https://pypi.org/user/ysskrishna",
    "https://www.patreon.com/cw/ysskrishna",
    "https://huggingface.co/ysskrishna",
    "https://ysskrishna.substack.com/"
  ]
};

const THEME_DEFAULTS = {
  accent: "#5b5bd6",
  accentHover: "#4545c4",
  accentGlow: "rgba(91, 91, 214, 0.22)"
};

function buildBaseCss(theme) {
  const t = { ...THEME_DEFAULTS, ...theme };
  const accent = escapeHtml(t.accent);
  const accentHover = escapeHtml(t.accentHover);
  const accentGlow = escapeHtml(t.accentGlow);
  return `
  :root {
    color-scheme: light dark;
    --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    --accent: ${accent};
    --accent-hover: ${accentHover};
    --accent-glow: ${accentGlow};
    --accent-soft: color-mix(in srgb, var(--accent) 14%, transparent);
    --radius: 14px;
    --radius-sm: 8px;
    --shadow-ribbon: 0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 40px -16px rgba(15, 23, 42, 0.12);
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f4f6fb;
      --surface: #ffffff;
      --surface-2: #f8f9fd;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: rgba(15, 23, 42, 0.08);
      --link: var(--accent);
      --link-hover: var(--accent-hover);
      --code-bg: rgba(15, 23, 42, 0.06);
    }
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0b0d12;
      --surface: #12151c;
      --surface-2: #181c26;
      --text: #e8eaef;
      --text-muted: #94a3b8;
      --border: rgba(255, 255, 255, 0.08);
      --link: #a5a6f5;
      --link-hover: #c4c5ff;
      --code-bg: rgba(255, 255, 255, 0.08);
    }
  }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: var(--font-sans);
    font-size: 1.0625rem;
    line-height: 1.65;
    color: var(--text);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }
  .page {
    max-width: 52rem;
    margin: 0 auto;
    padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 4vw, 1.75rem) 3.5rem;
  }
  .brand-ribbon {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem 1.5rem;
    padding: 1.125rem 1.25rem 1.125rem 1rem;
    margin-bottom: 2rem;
    background: linear-gradient(
      145deg,
      var(--surface) 0%,
      color-mix(in srgb, var(--accent) 5%, var(--surface)) 100%
    );
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-ribbon);
  }
  .brand-ribbon__identity {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-width: 0;
  }
  .brand-ribbon__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid var(--border);
    box-shadow: 0 0 0 1px var(--accent-soft);
  }
  .brand-ribbon__text { min-width: 0; }
  .brand-ribbon__name {
    display: block;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    line-height: 1.25;
    color: var(--text);
  }
  .brand-ribbon__handle {
    display: block;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }
  .brand-ribbon__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 0.625rem;
    align-items: center;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-decoration: none;
    border-radius: 999px;
    border: 1px solid transparent;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease;
  }
  .btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .btn--primary {
    color: #fff;
    background: linear-gradient(165deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 85%, #1e1b4b) 100%);
    box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent), 0 8px 24px -6px var(--accent-glow);
  }
  .btn--primary:hover {
    color: #fff;
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
  .btn--ghost {
    color: var(--text);
    background: var(--surface-2);
    border-color: var(--border);
  }
  .btn--ghost:hover {
    border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
    background: color-mix(in srgb, var(--accent) 8%, var(--surface-2));
    color: var(--link-hover);
  }
  .readme {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: clamp(1.25rem, 3vw, 2rem);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  }
  .readme :first-child { margin-top: 0; }
  .readme :last-child { margin-bottom: 0; }
  .readme h1 {
    font-size: clamp(1.5rem, 4vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 1rem;
    color: var(--text);
  }
  .readme h2, .readme h3 {
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 1.75rem 0 0.75rem;
    color: var(--text);
  }
  .readme h2 { font-size: 1.25rem; }
  .readme h3 { font-size: 1.1rem; }
  .readme p { margin: 0 0 1rem; color: var(--text); }
  .readme ul, .readme ol { margin: 0 0 1rem; padding-left: 1.35rem; }
  .readme li { margin: 0.35rem 0; }
  .readme a {
    color: var(--link);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
    font-weight: 500;
  }
  .readme a:hover { color: var(--link-hover); }
  .readme img { border-radius: var(--radius-sm); vertical-align: middle; }
  .readme hr {
    border: 0;
    height: 1px;
    margin: 2rem 0;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
  }
  .readme code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    padding: 0.15em 0.4em;
    border-radius: 6px;
    background: var(--code-bg);
  }
  .readme pre {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.55;
    padding: 1rem 1.1rem;
    border-radius: var(--radius-sm);
    background: var(--code-bg);
    border: 1px solid var(--border);
    overflow-x: auto;
    margin: 0 0 1rem;
  }
  .readme pre code { padding: 0; background: none; font-size: inherit; }
  .readme table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; margin: 0 0 1rem; font-size: 0.95rem; }
  .readme th, .readme td {
    border: 1px solid var(--border);
    padding: 0.55rem 0.75rem;
    text-align: left;
    vertical-align: top;
  }
  .readme th { background: var(--surface-2); font-weight: 600; }
  .readme blockquote {
    margin: 0 0 1rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--accent-soft);
    background: color-mix(in srgb, var(--accent) 4%, var(--surface));
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    color: var(--text-muted);
  }
`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSeo(profile) {
  const canonical = SITE_URL;
  return {
    title: `${profile.name} | ${profile.username}`,
    description: profile.bio,
    canonical,
    image: profile.image,
    siteName: new URL(canonical).hostname,
    imageAlt: profile.imageAlt,
    favicon: profile.favicon,
    appleTouchIcon: profile.appleTouchIcon,
    themeColorLight: profile.themeColorLight,
    themeColorDark: profile.themeColorDark,
    googleSiteVerification: profile.googleSiteVerification,
    author: profile.name,
    creator: profile.username
  };
}

function buildJsonLd(profile, seo) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name,
    alternateName: profile?.username,
    description: seo.description,
    url: profile?.website,
    image: seo.image,
    email: profile?.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile?.location
    },
    sameAs: profile?.sameAs
  };

  return JSON.stringify(jsonLd).replaceAll("</script>", "<\\/script>");
}

function buildBrandRibbon(profile) {
  const cta = profile?.cta;
  if (!cta?.portfolio?.href || !cta?.github?.href) return "";
  const pLabel = escapeHtml(cta.portfolio.label);
  const pHref = escapeHtml(cta.portfolio.href);
  const gLabel = escapeHtml(cta.github.label);
  const gHref = escapeHtml(cta.github.href);
  const name = escapeHtml(profile?.name);
  const handle = escapeHtml(`@${profile?.username ?? ""}`);
  const imgSrc = escapeHtml(profile?.image);
  const label = escapeHtml(`${profile?.name ?? "Profile"} — quick links`);
  return `    <header class="brand-ribbon" aria-label="${label}">
      <div class="brand-ribbon__identity">
        <img class="brand-ribbon__avatar" src="${imgSrc}" alt="" width="48" height="48" loading="lazy" decoding="async" />
        <div class="brand-ribbon__text">
          <span class="brand-ribbon__name">${name}</span>
          <span class="brand-ribbon__handle">${handle}</span>
        </div>
      </div>
      <nav class="brand-ribbon__nav" aria-label="Profile links">
        <a class="btn btn--primary" href="${pHref}">${pLabel}</a>
        <a class="btn btn--ghost" href="${gHref}">${gLabel}</a>
      </nav>
    </header>
`;
}

function htmlDocument(renderedMarkdown, seo, jsonLd, profile) {
  const ribbon = buildBrandRibbon(profile);
  const css = buildBaseCss(profile?.theme);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet" />
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}" />
  <link rel="canonical" href="${escapeHtml(seo.canonical)}" />
  <link rel="icon" href="${escapeHtml(seo.favicon)}" sizes="any" />
  <link rel="apple-touch-icon" href="${escapeHtml(seo.appleTouchIcon)}" />
  <meta name="robots" content="index,follow" />
  <meta name="author" content="${escapeHtml(seo.author)}" />
  <meta name="creator" content="${escapeHtml(seo.creator)}" />
  <meta name="theme-color" content="${escapeHtml(seo.themeColorLight)}" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="${escapeHtml(seo.themeColorDark)}" media="(prefers-color-scheme: dark)" />
  <meta name="google-site-verification" content="${escapeHtml(seo.googleSiteVerification)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(seo.title)}" />
  <meta property="og:description" content="${escapeHtml(seo.description)}" />
  <meta property="og:url" content="${escapeHtml(seo.canonical)}" />
  <meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />
  <meta property="og:image" content="${escapeHtml(seo.image)}" />
  <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
  <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
  <meta name="twitter:image" content="${escapeHtml(seo.image)}" />
  <meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />
  <script type="application/ld+json">${jsonLd}</script>
  <style>${css}</style>
</head>
<body>
  <div class="page">
  <main>
${ribbon}    <article class="readme">
${renderedMarkdown}
    </article>
  </main>
  </div>
</body>
</html>
`;
}

async function fetchReadme() {
  const response = await fetch(README_URL, {
    headers: {
      "User-Agent": "ysskrishna-github-io-sync"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch README: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function run() {
  marked.setOptions({
    gfm: true,
    breaks: false
  });
  const seo = buildSeo(PROFILE);
  const jsonLd = buildJsonLd(PROFILE, seo);
  const markdown = await fetchReadme();
  const rendered = marked.parse(markdown);
  const html = htmlDocument(rendered, seo, jsonLd, PROFILE);
  await writeFile(OUTPUT_PATH, html, "utf8");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
