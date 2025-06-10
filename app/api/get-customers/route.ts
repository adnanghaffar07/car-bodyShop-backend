import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `*[_type == "customerVehicleInfo"] | order(_createdAt desc)`;
    const results = await client.fetch(query);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Error fetching customerVehicleInfo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
