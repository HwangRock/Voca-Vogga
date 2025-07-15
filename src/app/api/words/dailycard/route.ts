/* eslint-disable @typescript-eslint/no-explicit-any */

/* endpoint : http://localhost:3000/api/words/dailycard?name=HwangRock */

import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function getTodaySeed(): number {
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const dateStr = kstNow.toISOString().slice(0, 10);
  let seed = 0;
  for (const c of dateStr) {
    seed += c.charCodeAt(0);
  }
  return seed;
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    const words = response.results.map((page: any) => ({
      english: page.properties.English.title[0]?.plain_text || '',
    }));

    const seed = getTodaySeed();

    const shuffled = shuffleWithSeed(words, seed);

    const dailyWords = shuffled.slice(0, 6);

    const cellWidth = 400 / 3;
    const rowHeights = [110, 160];

    const svgWords = dailyWords.map((w, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = cellWidth * col + cellWidth / 2;
      const y = rowHeights[row];
      const delay = 0.2 * i; // 각 단어마다 약간 딜레이 주기
      return `
        <text x="${x}" y="${y}" 
          font-size="20" fill="#ffffffff" opacity="0"
          font-family="Verdana, Sans-serif"
          text-anchor="middle" dominant-baseline="middle">
          ${w.english}
          <animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="${delay}s" fill="freeze" />
        </text>
      `;
    }).join('\n');


    const svg = `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#000000; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6; stop-opacity:1" />
          </linearGradient>
        </defs>
        <style>
          .title {
            font-size: 24px;
            fill: #f6f5f7;
            font-family: Georgia, serif;
          }
          .comment {
            font-size: 16px;
            fill: #94908dff;
            font-family: "Trebuchet MS", sans-serif;
          }
        </style>
        <rect width="100%" height="100%" fill="url(#grad1)" rx="20" ry="20"/>
        <text x="50%" y="20%" text-anchor="middle" dominant-baseline="middle">
            <tspan class="title" x="50%" dy="0">${name}</tspan>
            <tspan class="comment" x="50%" dy="36">오늘의 단어입니다. 오늘도 멋있는 하루 되세요!</tspan>
        </text>
        ${svgWords}
      </svg>
    `;

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}