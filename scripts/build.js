const fs = require('fs');
const path = require('path');

const root = process.cwd();
const out = path.join(root, 'public');

const entries = [
  'index.html',
  'resume.html',
  'certifications.html',
  'certifications.csv',
  'certifications.md',
  'source',
  'assets',
  'badges',
  'favicon.svg',
  'resume.pdf',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  '_redirects',
  'metadata.json'
];

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copy(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await ensureDir(dest);
    const items = await fs.promises.readdir(src);
    await Promise.all(items.map(item => copy(path.join(src, item), path.join(dest, item))));
  } else {
    await fs.promises.copyFile(src, dest);
  }
}

(async () => {
  try {
    await ensureDir(out);
    for (const entry of entries) {
      const src = path.join(root, entry);
      const dest = path.join(out, entry);
      try {
        await copy(src, dest);
        console.log('Copied', entry);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn('Skipping missing', entry);
        } else {
          throw err;
        }
      }
    }
    console.log('Build complete — output in', out);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
