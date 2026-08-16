import { describe, it, expect, beforeEach, vi } from "vitest";
import fs from "fs";
import path from "path";
import * as fontkit from "fontkit";
import {
  subsetFontToDataUri,
  getSubsettedFontDataUri,
  __resetSubsetCacheForTests,
  __getSubsetCacheSizeForTests,
} from "./font-subset";

const FONT_PATH = path.join(
  process.cwd(),
  "public",
  "font",
  "NanumJinJuBagGyeongACe.ttf"
);

describe("font-subset", () => {
  beforeEach(() => {
    __resetSubsetCacheForTests();
  });

  it(
    "getSubsettedFontDataUri returns a woff2 data URI whose cmap covers every non-space character of the input text",
    async () => {
      const text = "안녕하세요 Hello123";
      const result = await getSubsettedFontDataUri("test-id", text);

      expect(result).not.toBeNull();
      expect(result!.startsWith("data:font/woff2;base64,")).toBe(true);

      const base64 = result!.slice("data:font/woff2;base64,".length);
      const buffer = Buffer.from(base64, "base64");
      const font = fontkit.create(buffer);
      if (!("characterSet" in font)) {
        throw new Error(
          "expected a single Font, got a FontCollection (unexpected for a subsetted woff2)"
        );
      }

      for (const char of Array.from(new Set(text))) {
        if (/\s/.test(char)) continue;
        const codePoint = char.codePointAt(0)!;
        expect(font.characterSet).toContain(codePoint);
      }
    },
    15000
  );

  it(
    "returns the same string on a cache hit for identical id+text",
    async () => {
      const text = "캐시 테스트 Cache Test";
      const first = await getSubsettedFontDataUri("cache-id", text);
      const second = await getSubsettedFontDataUri("cache-id", text);

      expect(first).not.toBeNull();
      expect(second).toBe(first);
    },
    15000
  );

  it("returns null and logs a console.error when given a non-font buffer", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const garbage = Buffer.from("not a font");
    const result = await subsetFontToDataUri(garbage, "garbage-id", "text");

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it(
    "keeps the cache size at or below the 50-entry cap when exceeded by distinct keys",
    async () => {
      const fontBuffer = await fs.promises.readFile(FONT_PATH);

      for (let i = 0; i < 55; i++) {
        await subsetFontToDataUri(fontBuffer, `id-${i}`, `text-${i}`);
      }

      expect(__getSubsetCacheSizeForTests()).toBeLessThanOrEqual(50);
    },
    30000
  );

  it("returns null instead of throwing when the font file cannot be read from disk", async () => {
    vi.resetModules();
    vi.doMock("fs", () => {
      const readFile = vi
        .fn()
        .mockRejectedValue(new Error("ENOENT: no such file or directory"));
      return {
        default: { promises: { readFile } },
        promises: { readFile },
      };
    });

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      const isolatedModule = await import("./font-subset");

      await expect(
        isolatedModule.getSubsettedFontDataUri("missing-font-id", "text")
      ).resolves.toBeNull();
      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
      vi.doUnmock("fs");
      vi.resetModules();
    }
  });
});
