import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};
type DocumentItem = {
  _type: 'file';
  _key: string;
  asset: {
    _type: 'reference';
    _ref: string;
  };
};

export async function PUT(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const ownerId = formData.get('_id'); // You MUST pass this for update

    if (!ownerId || typeof ownerId !== 'string') {
      return NextResponse.json({ error: '_id is required for update' }, { status: 400 });
    }

    const updatableFields = ['fullName', 'businessName', 'email', 'phoneNumber', 'password', 'shopAddress'];
    const data: Record<string, string> = {};

    for (const field of updatableFields) {
      const value = formData.get(field);
      if (value && typeof value === 'string') {
        data[field] = value;
      }
    }

    const businessLicense = formData.get('businessLicense');
    const taxId = formData.get('taxId');
    const serviceAreaRadius = formData.get('serviceAreaRadius');

    const documents: DocumentItem[] = [];
    const files = formData.getAll('documents');

    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await client.assets.upload('file', buffer, {
          filename: file.name,
          contentType: file.type,
        });

        documents.push({
          _key: uuidv4(),
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        });
      }
    }

    const updateDoc = {
      ...data,
      businessLicense: typeof businessLicense === 'string' ? businessLicense : '',
      taxId: typeof taxId === 'string' ? taxId : '',
      serviceAreaRadius: serviceAreaRadius ? Number(serviceAreaRadius) : null,
      documents,
    };

    const updated = await client
      .patch(ownerId)
      .set(updateDoc)
      .commit();

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
