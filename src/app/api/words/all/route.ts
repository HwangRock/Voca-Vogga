/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

//endpoint : http://localhost:3000/api/words/all

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    const words = response.results.map((page: any) => ({
      english: page.properties.English.title[0]?.plain_text || '',
      korean: page.properties.Korean.rich_text[0]?.plain_text || '',
    }));

    const shuffled = shuffleArray(words);

    return NextResponse.json(shuffled);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
