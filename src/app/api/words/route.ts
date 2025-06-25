import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });

    const words = response.results.map((page: any) => ({
      english: page.properties.English.title[0]?.plain_text || '',
      korean: page.properties.Korean.rich_text[0]?.plain_text || '',
    }));

    return NextResponse.json(words);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
