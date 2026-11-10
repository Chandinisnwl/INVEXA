import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'invexa_super_secret_jwt_key_2026_venture_growth';
export const TOKEN_COOKIE_NAME = 'invexa_token';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Server-side helper to read and verify the logged-in user from cookies.
 */
export async function getAuthSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Helper to extract user from incoming Request (in Route Handlers)
 */
export function getUserFromRequest(request) {
  try {
    // 1. Check cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|; )${TOKEN_COOKIE_NAME}=([^;]*)`));
    let token = match ? decodeURIComponent(match[1]) : null;

    // 2. Check Authorization Bearer header
    if (!token) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

