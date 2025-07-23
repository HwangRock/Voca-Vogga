/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// endpoint: http://localhost:3000/api/cs/all

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_CS_DATABASE_ID!,
    });

    const csData = response.results
  .map((page: any) => ({
    category: page.properties.category?.title?.[0]?.plain_text || '',
    question: page.properties.question?.rich_text?.[0]?.plain_text || '',
  }))
  .reverse();


    return NextResponse.json(csData);
  } catch (error) {
    console.error('Notion API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CS data' },
      { status: 500 }
    );
  }
}