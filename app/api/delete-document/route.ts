// app/api/delete-document/route.ts
import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await client.delete(id);

    return NextResponse.json({ message: `Document ${id} deleted` }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

