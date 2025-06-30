import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT_SECRET = process.env.JWT_SECRET || 'ffftfyjioijioj67899898crtfdr';
const ACCESS_TOKEN_EXPIRE = '15d';
const REFRESH_TOKEN_EXPIRE = '30d';

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
    const email = data.email.toLowerCase();

    // Check if an owner already exists with the same email
    const existingOwner = await client.fetch(
      `*[_type == "bodyShopOwner" && email == $email][0]`,
      { email }
    );

    if (existingOwner) {
      return NextResponse.json(
        { error: 'An account already exists with your email' },
        { status: 400 }
      );
    }

    const businessLicense = formData.get('businessLicense');
    const taxId = formData.get('taxId');
    const serviceAreaRadius = formData.get('serviceAreaRadius');
    const state = formData.get('state');
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

    // Upload logo if provided
    const logoFile = formData.get('logo');
    let logoAssetRef = null;

    if (logoFile instanceof File) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const logoAsset = await client.assets.upload('image', buffer, {
        filename: logoFile.name,
        contentType: logoFile.type,
      });

      logoAssetRef = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: logoAsset._id,
        },
      };
    }


    const ownerDoc = {
      _type: 'bodyShopOwner',
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      shopAddress: data.shopAddress,
      state: typeof state === 'string' ? state : '',
      businessLicense: typeof businessLicense === 'string' ? businessLicense : '',
      taxId: typeof taxId === 'string' ? taxId : '',
      serviceAreaRadius: serviceAreaRadius ? Number(serviceAreaRadius) : null,
      documents,
      logo: logoAssetRef,
    };


    const createdOwner = await client.create(ownerDoc);

    // JWT payload
    const basePayload = {
      userId: createdOwner._id,
      email: createdOwner.email,
      fullName: createdOwner.fullName,
    };

    // Tokens
    const accessToken = jwt.sign({ ...basePayload, tokenType: 'access' }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = jwt.sign({ ...basePayload, tokenType: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });

    // Response
    const res = NextResponse.json({
      success: true,
      message: 'Owner profile created successfully',
      accessToken,
      refreshToken,
      user: {
        _id: createdOwner._id,
        ...ownerDoc,
      },
    });

    // Set refresh token as HttpOnly cookie
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
