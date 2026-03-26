import { NextResponse } from 'next/server';
import { registerUser } from '@/services/mockAuth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const user = await registerUser(email, password);
    if (!user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Return mock token on registration
    const token = `mock-token-${user.id}`;
    return NextResponse.json({ message: 'Registered', user, token }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
