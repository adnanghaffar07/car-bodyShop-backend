import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ffftfyjioijioj67899898crtfdr';
const ACCESS_TOKEN_EXPIRE = '15d';
const REFRESH_TOKEN_EXPIRE = '30d';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    } catch {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 403 });
    }

    if (decoded.tokenType !== 'refresh') {
      return NextResponse.json({ error: 'Invalid token type' }, { status: 403 });
    }

    const userPayload = {
      userId: decoded.userId,
      email: decoded.email,
      fullName: decoded.fullName,
    };

    // Generate new tokens
    const newAccessToken = jwt.sign({ ...userPayload, tokenType: 'access' }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    const newRefreshToken = jwt.sign({ ...userPayload, tokenType: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });

    const res = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    // Update refresh token cookie
    res.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Refresh token error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
