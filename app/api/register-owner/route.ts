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

export async function POST(req: NextRequest) {
  try {
    // Only accept multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const requiredFields = ['fullName', 'businessName', 'email', 'phoneNumber', 'password', 'shopAddress'];
    const data: Record<string, string> = {};

    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || typeof value !== 'string') {
        return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
      }
      data[field] = value;
    }

    // Optional fields
    const businessLicense = formData.get('businessLicense');
    const taxId = formData.get('taxId');
    const serviceAreaRadius = formData.get('serviceAreaRadius');

    // Process documents
    const documents: DocumentItem[] = [];
    const files = formData.getAll('documents');

    for (const file of files) {
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

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

    const ownerDoc = {
      _type: 'bodyShopOwner',
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      shopAddress: data.shopAddress,
      businessLicense: typeof businessLicense === 'string' ? businessLicense : '',
      taxId: typeof taxId === 'string' ? taxId : '',
      serviceAreaRadius: serviceAreaRadius ? Number(serviceAreaRadius) : null,
      documents,
    };

    await client.create(ownerDoc);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
