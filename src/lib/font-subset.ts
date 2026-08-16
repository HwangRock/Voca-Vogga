import fs from "fs";
import path from "path";
import subsetFont from "subset-font";

const FONT_FILE_PATH = path.join(
  process.cwd(),
  "public",
  "font",
  "NanumJinJuBagGyeongACe.ttf"
);
const MAX_CACHE_ENTRIES = 50;

let fontBufferPromise: Promise<Buffer | null> | null = null;
function loadFontBuffer(): Promise<Buffer | null> {
  if (!fontBufferPromise) {
    fontBufferPromise = fs.promises.readFile(FONT_FILE_PATH).catch((err) => {
      console.error("[font-subset] failed to read font file", {
        path: FONT_FILE_PATH,
        error: err instanceof Error ? err.message : String(err),
      });
      fontBufferPromise = null;
      return null;
    });
  }
  return fontBufferPromise;
}

const subsetCache = new Map<string, string>();

function charsetKey(text: string): string {
  return Array.from(new Set(text)).sort().join("");
}

function evictIfFull() {
  if (subsetCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = subsetCache.keys().next().value;
    if (oldestKey !== undefined) subsetCache.delete(oldestKey);
  }
}

export async function subsetFontToDataUri(
  fontBuffer: Buffer,
  id: string,
  text: string
): Promise<string | null> {
  const key = `${id}::${charsetKey(text)}`;
  const cached = subsetCache.get(key);
  if (cached) return cached;

  try {
    const subsetBuffer = await subsetFont(fontBuffer, text, {
      targetFormat: "woff2",
    });
    const dataUri = `data:font/woff2;base64,${subsetBuffer.toString("base64")}`;
    evictIfFull();
    subsetCache.set(key, dataUri);
    return dataUri;
  } catch (err) {
    console.error(
      "[font-subset] subsetting failed, caller should fall back to full font",
      {
        id,
        textLength: text.length,
        error: err instanceof Error ? err.message : String(err),
      }
    );
    return null;
  }
}

export async function getSubsettedFontDataUri(
  id: string,
  text: string
): Promise<string | null> {
  const fontBuffer = await loadFontBuffer();
  if (!fontBuffer) return null;
  return subsetFontToDataUri(fontBuffer, id, text);
}

export function __resetSubsetCacheForTests() {
  subsetCache.clear();
}

export function __resetFontBufferCacheForTests() {
  fontBufferPromise = null;
}

export function __getSubsetCacheSizeForTests() {
  return subsetCache.size;
}
