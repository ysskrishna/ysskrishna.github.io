import { writeFile } from "node:fs/promises";
import { marked } from "marked";

const README_URL =
  "https://raw.githubusercontent.com/ysskrishna/ysskrishna/main/README.md";
const OUTPUT_PATH = "index.html";
const SITE_URL = "https://ysskrishna.github.io/";

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

function htmlDocument(renderedMarkdown) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Siva Sai Krishna | ysskrishna</title>
  <meta name="description" content="AI-focused full stack developer profile mirrored from GitHub README." />
  <link rel="canonical" href="${SITE_URL}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Siva Sai Krishna | ysskrishna" />
  <meta property="og:description" content="AI-focused full stack developer profile mirrored from GitHub README." />
  <meta property="og:url" content="${SITE_URL}" />
  <meta property="og:site_name" content="ysskrishna.github.io" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Siva Sai Krishna | ysskrishna" />
  <meta name="twitter:description" content="AI-focused full stack developer profile mirrored from GitHub README." />
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
  const markdown = await fetchReadme();
  const rendered = marked.parse(markdown);
  const html = htmlDocument(rendered);
  await writeFile(OUTPUT_PATH, html, "utf8");
  console.log(`Generated ${OUTPUT_PATH} from ${README_URL}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
