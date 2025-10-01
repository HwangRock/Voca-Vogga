import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

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

   const itemsSvg = slicedPosts
      .map(
        (post: { title?: string; link?: string }, i: number) => `
        <a href="${post.link}" target="_blank">
          <text x="50%" y="${30 + i * 15}%" text-anchor="middle" class="comment">
            ${post.title}
          </text>
        </a>
      `
      )
      .join("");

    const svg = `
      <svg width="700" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#21985cff; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#5feba5ff; stop-opacity:1" />
          </linearGradient>
        </defs>
        <style>
          .title {
            font-size: 24px;
            fill: #0b0b0bff;
            font-family: "Trebuchet MS", sans-serif;
          }
          .comment {
            font-size: 15px;
            fill: #ffffff;
            font-family: "Trebuchet MS", sans-serif;
            cursor: pointer;
          }
        </style>
        <rect width="100%" height="100%" fill="url(#grad-green)" rx="20" ry="20"/>
        <text x="50%" y="15%" text-anchor="middle" class="title">
          ${id}'s velog post
        </text>
        ${itemsSvg}
      </svg>
    `;

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