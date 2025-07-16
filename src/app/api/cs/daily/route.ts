/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from '@notionhq/client';

// endpoint : http://localhost:3000/api/cs/daily?name=HwangRock

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
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";

  const response = await notion.databases.query({
    database_id: process.env.NOTION_CS_DATABASE_ID!,
  });

  const csData = response.results.map((page: any) => ({
    category: page.properties.category?.title?.[0]?.plain_text || '',
    question: page.properties.question?.rich_text?.[0]?.plain_text || '',
  }));

  const seed = getTodaySeed();
  const shuffled = shuffleWithSeed(csData, seed);

  const daily = shuffled[0] || { category: '', question: '' };

  const svg = `
    <svg width="900" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#04411a; stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16a34a; stop-opacity:1" />
        </linearGradient>
      </defs>
      <style>
        .title {
          font-size: 24px;
          fill: #f6f5f7;
          font-family: Georgia, serif;
        }
        .comment {
          font-size: 15px;
          fill: #94908dff;
          font-family: "Trebuchet MS", sans-serif;
        }
        .category {
          font-size: 18px;
          fill: #f8fafbff;
        }
        .question {
          font-size: 25px;
          fill: #f8fafbff;
          font-family="Verdana, Sans-serif";
        }
      </style>
      <rect width="100%" height="100%" fill="url(#grad-green)" rx="20" ry="20"/>
      <text x="50%" y="20%" text-anchor="middle" dominant-baseline="middle">
        <tspan class="title" x="50%" dy="0">${name}</tspan>
        <tspan class="comment" x="50%" dy="36">오늘의 생각거리입니다. 깊이 숙고해보시고 한번 정리해주세요!</tspan>
        <tspan class="category" x="50%" dy="36">${daily.category}에 대한 질문입니다.</tspan>
        <tspan class="question" x="50%" dy="50">${daily.question}</tspan>
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
