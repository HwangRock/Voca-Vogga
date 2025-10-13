export const runtime = "nodejs";

import { parseStringPromise } from "xml2js";
import { velogSvg } from "./blogSvg";
import {
  POSTIT_1__BASE64,
  POSTIT_2__BASE64,
  POSTIT_3__BASE64,
  NANUM_FONT_BASE64
} from "@/lib/base64-assets"; // prebuild로 생성된 파일 경로

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    const res = await fetch(`https://v2.velog.io/rss/${id}`);
    const xml = await res.text();
    const data = await parseStringPromise(xml, { explicitArray: false });

    const rawPosts = data.rss.channel.item;
    const posts = Array.isArray(rawPosts) ? rawPosts : [rawPosts];
    const slicedPosts = posts.slice(0, 5);

    const imgs = [
      POSTIT_1__BASE64,
      POSTIT_2__BASE64,
      POSTIT_3__BASE64,
      POSTIT_1__BASE64,
      POSTIT_2__BASE64,
    ];

    const svg = velogSvg(id, slicedPosts, { inlineImages: imgs, inlineFontDataUri: NANUM_FONT_BASE64 });

    return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
