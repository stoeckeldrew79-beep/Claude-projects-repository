// Build-time sitemap generator. Runs as a postbuild step so sitemap.xml
// always reflects the live database at deploy time — this is a plain
// Vite SPA (no SSR), so there's no per-request way to generate it.
//
// Requires the API to be reachable at build time (API_BASE_URL). If it
// isn't (e.g. a build run with no backend available), this logs a
// warning and skips rather than failing the whole build.
const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.SITE_URL ?? 'https://scamshieldnational.com';
const API_BASE_URL = process.env.API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? 'http://localhost:3000/v1';
const OUT_PATH = path.join(__dirname, '..', 'dist', 'sitemap.xml');

const STATIC_PATHS = ['/', '/database', '/articles', '/notorious', '/report', '/subscribe'];

function urlEntry(loc, lastmod) {
  return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
}

async function fetchAll(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  const { data } = await res.json();
  return data;
}

async function main() {
  const entries = STATIC_PATHS.map((p) => urlEntry(`${SITE_URL}${p}`));

  try {
    const scams = await fetchAll('/scams?page=1');
    for (const scam of scams) {
      entries.push(urlEntry(`${SITE_URL}/scams/${scam.slug}`, scam.updated_at?.slice(0, 10)));
    }

    const articles = await fetchAll('/articles');
    for (const article of articles) {
      entries.push(urlEntry(`${SITE_URL}/articles/${article.slug}`, article.published_at?.slice(0, 10)));
    }
  } catch (err) {
    console.warn(`sitemap: couldn't reach API at ${API_BASE_URL}, writing static pages only (${err.message})`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, xml);
  console.log(`sitemap: wrote ${entries.length} URLs to ${OUT_PATH}`);
}

main();
