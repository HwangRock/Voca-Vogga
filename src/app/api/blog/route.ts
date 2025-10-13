export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";
import { velogSvg } from "./blogSvg";

// http://localhost:3000/api/blog?id=hwangrock1220

function fileToDataUri(relPath: string, mime = "image/png") {
  const abs = path.join(process.cwd(), relPath.replace(/^\//, ""));
  const buf = fs.readFileSync(abs);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    const res = await fetch(`https://v2.velog.io/rss/${id}`);
    const xml = await res.text();
    const data = await parseStringPromise(xml, { explicitArray: false });

    const rawPosts = data.rss.channel.item;
    const posts = Array.isArray(rawPosts) ? rawPosts : [rawPosts]; // 슬프게도 1개일때는 배열로 오지않고 object로만 온다
    const slicedPosts = posts.slice(0, 5);

    const imgs = [
      fileToDataUri("public/postit.png", "image/png"),
      fileToDataUri("public/postit2.png", "image/png"),
      fileToDataUri("public/postit3.png", "image/png"),
      fileToDataUri("public/postit.png", "image/png"),
      fileToDataUri("public/postit2.png", "image/png"),
    ];

    // 폰트를 ttf에서 woff2로 바꿔야하나 일단 고민
    const fontRel = "public/font/NanumJinJuBagGyeongACe.ttf";
    const fontMime = "font/ttf";
    const fontDataUri = fileToDataUri(fontRel, fontMime);

    const svg = velogSvg(id, slicedPosts, { inlineImages: imgs, inlineFontDataUri: fontDataUri });

    return new Response(svg, {
      headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
