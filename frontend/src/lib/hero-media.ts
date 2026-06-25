import { readdir } from "node:fs/promises";
import path from "node:path";

const HERO_MEDIA_DIRECTORY = path.join(process.cwd(), "public", "images", "hero");
const HERO_MEDIA_EXTENSIONS = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);

export async function getHeroMediaPaths(): Promise<string[]> {
  try {
    const entries = await readdir(HERO_MEDIA_DIRECTORY, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => HERO_MEDIA_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .sort((left, right) => left.localeCompare(right))
      .map((fileName) => `/images/hero/${fileName}`);
  } catch {
    return [];
  }
}
