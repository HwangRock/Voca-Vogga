export const runtime = "nodejs";

import { parseStringPromise } from "xml2js";
import { velogSvg } from "./blogSvg";
import {
  POSTIT_1__BASE64,
  POSTIT_2__BASE64,
  POSTIT_3__BASE64,
  NANUM_FONT_BASE64
} from "@/lib/base64-assets";
import crypto from "crypto";

const CACHE_TTL = 12 * 60 * 60;

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

    const etag=crypto.createHash("sha1").update(svg).digest("hex");
    const ifNoneMatch = request.headers.get("if-none-match");
    const cacheControlValue = `public, max-age=${CACHE_TTL}`;

    if (ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {  
          "Cache-Control": cacheControlValue,
          "ETag": etag
        }
      });
    }
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": cacheControlValue,
        "ETag": etag
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
