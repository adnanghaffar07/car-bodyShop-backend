import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get('id');

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

      type VehicleDoc = {
      _id: string;
    };

      // Fetch all vehicles created by this owner (createdBy is a string)
    const submittedVehicles: VehicleDoc[] = await client.fetch(
      `*[_type == "customerVehicleInfo" && createdBy == $ownerId]{ _id }`,
      { ownerId }
    );

    const vehicleIds = submittedVehicles.map((vehicle) => vehicle._id);

    // Prepare delete mutations: all vehicles + the owner
    const mutations = [
      ...vehicleIds.map((id) => ({ delete: { id } })),
      { delete: { id: ownerId } },
    ];

    await client.transaction(mutations).commit();

    return NextResponse.json({
      success: true,
      message: `Owner and ${vehicleIds.length} vehicle(s) deleted successfully.`,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
