import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://www.thecarboncredit.in";
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/agricultural-mrv",
  "/business-impact",
  "/calculator",
  "/carbon-credits",
  "/contact",
  "/field-programs",
  "/how-it-works",
  "/methodology",
  "/partners",
  "/passport",
  "/platform",
  "/privacy",
  "/research",
  "/solutions",
  "/terms",
];

const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");
const robotsPath = path.resolve(process.cwd(), "public/robots.txt");
const isCheckMode = process.argv.includes("--check");

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_ROUTES.map((route) => `  <url><loc>${BASE_URL}${route === "/" ? "/" : route}</loc></url>`).join("\n")}
</urlset>
`;

if (isCheckMode) {
  if (!fs.existsSync(sitemapPath)) {
    console.error(`Sitemap check failed: ${sitemapPath} does not exist.`);
    process.exit(1);
  }
  if (!fs.existsSync(robotsPath)) {
    console.error(`Robots check failed: ${robotsPath} does not exist.`);
    process.exit(1);
  }

  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(`Sitemap: ${BASE_URL}/sitemap.xml`)) {
    console.error(`Robots check failed: missing Sitemap directive.`);
    process.exit(1);
  }

  console.log(`Sitemap check passed: ${PUBLIC_ROUTES.length} indexable public routes.`);
} else {
  fs.writeFileSync(sitemapPath, sitemapContent, "utf8");
  console.log(`Sitemap generated: ${PUBLIC_ROUTES.length} indexable public routes.`);
}
