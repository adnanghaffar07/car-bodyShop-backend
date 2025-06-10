// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';

const JWT_SECRET = process.env.JWT_SECRET || 'ffftfyjioijioj67899898crtfdr';

export async function GET(req: NextRequest) {
    try {
        // Get the access token from Authorization header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authorization token missing' },
                { status: 401 }
            );
        }

        const accessToken = authHeader.split(' ')[1];

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(accessToken, JWT_SECRET) as {
                userId: string;
                email: string;
                fullName: string;
                tokenType: string;
            };
        } catch {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Verify it's an access token
        if (decoded.tokenType !== 'access') {
            return NextResponse.json(
                { error: 'Invalid token type' },
                { status: 401 }
            );
        }

        // Fetch user from Sanity
        const query = `*[_type == "bodyShopOwner" && _id == $userId][0]`;

        const user = await client.fetch(query, { userId: decoded.userId });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user data (excluding sensitive fields)
        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                fullName: user.fullName,
                businessName: user.businessName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                shopAddress: user.shopAddress,
                businessLicense: user.businessLicense,
                taxId: user.taxId,
                serviceAreaRadius: user.serviceAreaRadius,
                documents: user.documents || []
            }
        });

    } catch (err) {
        console.error('Profile fetch error:', err);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}