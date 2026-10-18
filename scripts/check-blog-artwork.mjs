import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { validateCuratedArtwork } from './blog-artwork.mjs';

try {
  const covers = 'public/blog-covers';
  const metadata = existsSync(covers)
    ? readdirSync(covers).filter((file) => file.endsWith('.artwork.json'))
    : [];
  for (const file of metadata) {
    const match = file.match(/^(.+)-(zh|en)\.artwork\.json$/);
    if (!match) throw new Error(`Curated cover needs review: ${file} (unknown article locale)`);
    const [, slug, lang] = match;
    const article = `content/blog/${lang}/${slug}.md`;
    if (!existsSync(article))
      throw new Error(`Curated cover needs review: ${file} (article missing)`);
    const frontmatter = readFileSync(article, 'utf8')
      .replaceAll('\r\n', '\n')
      .match(/^---\n(\{[\s\S]*?\})\n---\n/);
    if (!frontmatter) throw new Error(`Invalid article frontmatter: ${article}`);
    validateCuratedArtwork(`${covers}/${slug}-${lang}.png`, JSON.parse(frontmatter[1]).title);
  }
  console.log(`Validated ${metadata.length} curated blog covers; no artwork modified.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
