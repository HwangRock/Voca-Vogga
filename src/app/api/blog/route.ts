import { parseStringPromise } from "xml2js";
import { velogSvg } from "./blogSvg";

// http://localhost:3000/api/blog?id=hwangrock1220

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    const res = await fetch(`https://v2.velog.io/rss/${id}`);
    const xml = await res.text();

    const data = await parseStringPromise(xml, { explicitArray: false });

    const rawPosts = data.rss.channel.item;
    const posts = Array.isArray(rawPosts) ? rawPosts : [rawPosts]; // 슬프게도 1개일때는 배열로 오지않고 object로만 온다

    const slicedPosts=posts.slice(0,5);
      const svg=velogSvg(id,slicedPosts);
      return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
    
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}