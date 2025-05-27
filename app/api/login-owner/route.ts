import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { client } from '@/sanity/lib/client';

const JWT_SECRET = process.env.JWT_SECRET || 'ffftfyjioijioj67899898crtfdr';

// Token expiry durations
const ACCESS_TOKEN_EXPIRE = '15d'; // 15 days
const REFRESH_TOKEN_EXPIRE = '30d'; // 30 days

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // Sanity query to find user
        const query = `*[_type == "bodyShopOwner" && email == $email && password == $password][0]`;
        const user = await client.fetch(query, { email, password });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Base payload data
        const basePayload = {
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
        };

        // Sign access token with tokenType 'access'
        const accessToken = jwt.sign({ ...basePayload, tokenType: 'access' }, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRE,
        });

        // Sign refresh token with tokenType 'refresh'
        const refreshToken = jwt.sign({ ...basePayload, tokenType: 'refresh' }, JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRE,
        });

        // Create response JSON with both tokens
        const res = NextResponse.json({
            success: true,
            accessToken,
            refreshToken,  // Added refresh token here for easy retrieval
            user: { email: user.email, fullName: user.fullName },
        });

        // Set HttpOnly cookie with refresh token (optional, but recommended for security)
        res.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
            path: '/',
        });

        return res;
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
