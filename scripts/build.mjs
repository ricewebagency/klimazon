import { rmSync, mkdirSync, cpSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SRC = "src";
const DOCS = "docs";

function clean() {
  if (existsSync(DOCS)) rmSync(DOCS, { recursive: true, force: true });
  mkdirSync(`${DOCS}/css`, { recursive: true });
  mkdirSync(`${DOCS}/js`, { recursive: true });
  mkdirSync(`${DOCS}/assets`, { recursive: true });
}

function syncTree(fromDir, toDir) {
  mkdirSync(toDir, { recursive: true });

  for (const entry of readdirSync(fromDir, { withFileTypes: true })) {
    const sourcePath = `${fromDir}/${entry.name}`;
    const targetPath = `${toDir}/${entry.name}`;

    if (entry.isDirectory()) {
      syncTree(sourcePath, targetPath);
      continue;
    }

    cpSync(sourcePath, targetPath, { force: true });
  }
}

function copyStatic() {
  syncTree(SRC, DOCS);

  // kopieer root-bestanden die direct in docs moeten staan
  for (const file of ["sitemap.xml", "robots.txt", "site.webmanifest"]) {
    if (existsSync(`${SRC}/${file}`)) {
      copyFileSync(`${SRC}/${file}`, `${DOCS}/${file}`);
    }
  }
}

function buildCss() {
  execSync(
    "npx tailwindcss -i ./src/css/main.css -o ./docs/css/main.css --postcss --minify",
    { stdio: "inherit" }
  );
}

clean();
copyStatic();
buildCss();
