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
  email: "sivasaikrishnassk@gmail.com",
  website: "https://ysskrishna.vercel.app",
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

const baseCss = `
  :root { color-scheme: light dark; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
    line-height: 1.6;
  }
  img { max-width: 100%; height: auto; }
  table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
  th, td { border: 1px solid #d0d7de; padding: 0.5rem; text-align: left; vertical-align: top; }
  a { color: #0969da; }
  hr { border: 0; border-top: 1px solid #d0d7de; margin: 2rem 0; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildSeo(profile) {
  const title = `${profile?.name} | ${profile?.username}`;
  const description = profile?.bio;
  const canonical = SITE_URL;
  const image = profile?.image;
  const siteName = new URL(canonical).hostname;

  return {
    title,
    description,
    canonical,
    image,
    siteName
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

function htmlDocument(renderedMarkdown, seo, jsonLd) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}" />
  <link rel="canonical" href="${escapeHtml(seo.canonical)}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(seo.title)}" />
  <meta property="og:description" content="${escapeHtml(seo.description)}" />
  <meta property="og:url" content="${escapeHtml(seo.canonical)}" />
  <meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />
  <meta property="og:image" content="${escapeHtml(seo.image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
  <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
  <meta name="twitter:image" content="${escapeHtml(seo.image)}" />
  <script type="application/ld+json">${jsonLd}</script>
  <style>${baseCss}</style>
</head>
<body>
  <main>
${renderedMarkdown}
  </main>
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
  const html = htmlDocument(rendered, seo, jsonLd);
  await writeFile(OUTPUT_PATH, html, "utf8");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
