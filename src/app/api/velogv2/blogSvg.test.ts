import { describe, it, expect } from "vitest";
import { velogSvg, collectRenderedText, formatPubDate } from "./blogSvg";
import { FIXED_PHRASES } from "./textContent";

describe("collectRenderedText", () => {
  it("포함: id, 포스트 제목, 포맷된 날짜, 모든 고정 문구", () => {
    const id = "hwangrock1220";
    const posts = [
      { title: "테스트 제목입니다", pubDate: "2024-01-15T00:00:00.000Z" },
    ];

    const result = collectRenderedText(id, posts);

    expect(result).toContain(id);
    expect(result).toContain(posts[0].title);
    expect(result).toContain(formatPubDate(posts[0].pubDate));
    for (const phrase of Object.values(FIXED_PHRASES)) {
      expect(result).toContain(phrase);
    }
  });

  it("상위 5개 포스트만 수집하고 6번째 이후 제목은 포함하지 않는다", () => {
    const id = "hwangrock1220";
    const posts = Array.from({ length: 8 }, (_, i) => ({
      title: `포스트제목${i}`,
      pubDate: "2024-01-15T00:00:00.000Z",
    }));

    const result = collectRenderedText(id, posts);

    for (let i = 0; i < 5; i++) {
      expect(result).toContain(`포스트제목${i}`);
    }
    for (let i = 5; i < 8; i++) {
      expect(result).not.toContain(`포스트제목${i}`);
    }
  });

  it("이스케이프 이전 원문자를 모은다 (& < 등 엔티티로 변환되지 않음)", () => {
    const id = "hwangrock1220";
    const posts = [
      { title: "A & B < C", pubDate: "2024-01-15T00:00:00.000Z" },
    ];

    const result = collectRenderedText(id, posts);

    expect(result).toContain("A & B < C");
    expect(result).not.toContain("&amp;");
    expect(result).not.toContain("&lt;");
  });
});

describe("velogSvg", () => {
  const basePosts = Array.from({ length: 5 }, (_, i) => ({
    title: `제목${i}`,
    link: `https://velog.io/@id/post${i}`,
    pubDate: "2024-01-15T00:00:00.000Z",
  }));

  it("inlineImages 중복 제거: 3개 고유값 + 2개 중복 -> <image> 3개, <use> 5개", () => {
    const images = ["img-a.png", "img-b.png", "img-c.png", "img-a.png", "img-b.png"];

    const svg = velogSvg("hwangrock1220", basePosts, { inlineImages: images });

    const imageCount = (svg.match(/<image /g) ?? []).length;
    const useCount = (svg.match(/<use /g) ?? []).length;

    expect(imageCount).toBe(3);
    expect(useCount).toBe(5);
  });

  it("@font-face 포맷: woff2 data URI -> format('woff2')", () => {
    const svg = velogSvg("hwangrock1220", basePosts, {
      inlineFontDataUri: "data:font/woff2;base64,AAAA",
    });

    expect(svg).toContain("format('woff2')");
  });

  it("@font-face 포맷: ttf data URI -> format('truetype')", () => {
    const svg = velogSvg("hwangrock1220", basePosts, {
      inlineFontDataUri: "data:font/ttf;base64,AAAA",
    });

    expect(svg).toContain("format('truetype')");
  });

  it("기본 호출 시 ~햇감자~가 틸데째로 포함되고 다혀니는 미포함", () => {
    const svg = velogSvg("hwangrock1220", []);

    expect(svg).toContain("~햇감자~");
    expect(svg).not.toContain("다혀니");
  });
});
