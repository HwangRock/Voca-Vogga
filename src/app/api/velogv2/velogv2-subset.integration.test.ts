import { describe, it, expect, vi } from "vitest";
import * as fontkit from "fontkit";
import { velogSvg, collectRenderedText } from "./blogSvg";
import {
  getSubsettedFontDataUri,
  subsetFontToDataUri,
  __resetSubsetCacheForTests,
} from "@/lib/font-subset";
import { NANUM_FONT_BASE64 } from "@/lib/base64-assets";

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function extractTextNodes(svg: string): string {
  const matches = svg.match(/>([^<>{}]+)</g) ?? [];
  return matches.map((m) => decodeXmlEntities(m.slice(1, -1))).join("");
}

describe("velogv2 subset pipeline integration", () => {
  it(
    "every non-space glyph rendered in the SVG exists in the subsetted font's characterSet",
    async () => {
      __resetSubsetCacheForTests();

      const id = "인테그레이션테스트유저";
      const posts = [
        {
          title: "한글 제목으로 작성한 게시글입니다",
          link: "https://velog.io/@test/post-1",
          pubDate: "2024-01-15T00:00:00.000Z",
        },
        {
          title: "English Title for Integration Test",
          link: "https://velog.io/@test/post-2",
          pubDate: "2024-02-20T00:00:00.000Z",
        },
        {
          title: `특수문자 테스트 & <script> "quote" 'apostrophe'`,
          link: "https://velog.io/@test/post-3",
          pubDate: "2024-03-05T00:00:00.000Z",
        },
        {
          title: "Mixed 혼합 Title 123 !@#$%^&*()",
          link: "https://velog.io/@test/post-4",
          pubDate: "2024-04-10T00:00:00.000Z",
        },
        {
          title:
            "긴 제목이라서 line-clamp 으로 잘리는 다섯번째 게시글의 전체 제목 텍스트입니다 abcdefg",
          link: "https://velog.io/@test/post-5",
          pubDate: "2024-05-25T00:00:00.000Z",
        },
      ];

      // route.ts의 실제 파이프라인 순서: collectRenderedText -> getSubsettedFontDataUri -> velogSvg
      const charset = collectRenderedText(
        id,
        posts.map((p) => ({ title: p.title, pubDate: p.pubDate }))
      );
      const subsetFontUri = await getSubsettedFontDataUri(id, charset);
      expect(subsetFontUri).not.toBeNull();
      expect(subsetFontUri!.startsWith("data:font/woff2;base64,")).toBe(true);

      const svg = velogSvg(id, posts, { inlineFontDataUri: subsetFontUri! });

      const base64 = subsetFontUri!.slice("data:font/woff2;base64,".length);
      const fontBuffer = Buffer.from(base64, "base64");
      const font = fontkit.create(fontBuffer);
      if (!("characterSet" in font)) {
        throw new Error(
          "expected a single Font, got a FontCollection (unexpected for a subsetted woff2)"
        );
      }

      const renderedText = extractTextNodes(svg);
      const missing: string[] = [];
      for (const char of Array.from(new Set(renderedText))) {
        if (/\s/.test(char)) continue;
        const codePoint = char.codePointAt(0)!;
        if (!font.characterSet.includes(codePoint)) {
          missing.push(
            `missing glyph for "${char}" (U+${codePoint
              .toString(16)
              .toUpperCase()
              .padStart(4, "0")})`
          );
        }
      }

      expect(missing).toEqual([]);
    },
    20000
  );

  it("falls back to NANUM_FONT_BASE64 when getSubsettedFontDataUri returns null", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const garbageBuffer = Buffer.from("not a font");
    const subsetFontUri = await subsetFontToDataUri(
      garbageBuffer,
      "fallback-test-id",
      "text"
    );
    expect(subsetFontUri).toBeNull();

    const fontDataUri = subsetFontUri ?? NANUM_FONT_BASE64;
    expect(fontDataUri).toBe(NANUM_FONT_BASE64);

    errorSpy.mockRestore();
  });
});
