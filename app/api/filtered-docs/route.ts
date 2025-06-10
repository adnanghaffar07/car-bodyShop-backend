import { NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client' // Adjust this path if needed

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  // 1. Validate that userId is provided
  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId in query parameters' },
      { status: 400 }
    )
  }

  try {
    // 2. GROQ query to fetch documents where createdBy matches userId
    const query = groq`
      *[_type == "customerVehicleInfo" && createdBy == $userId] 
      | order(_createdAt desc)
    `
    
    const vehicles = await client.fetch(query, { userId })

    // 3. Return the matching documents
    return NextResponse.json({ vehicles }, { status: 200 })
  } catch (error) {
    console.error('Error fetching vehicle data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
