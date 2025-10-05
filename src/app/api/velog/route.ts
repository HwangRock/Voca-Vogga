import { parseStringPromise } from "xml2js";
import { velogSvg } from "./velogSvg";

// http://localhost:3000/api/velog?id=hwangrock1220

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    const res = await fetch(`https://v2.velog.io/rss/${id}`);
    const xml = await res.text();

    const data = await parseStringPromise(xml, { explicitArray: false });

    const posts = data.rss.channel.item;
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