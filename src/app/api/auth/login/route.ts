import { NextResponse } from 'next/server';
import { findUser } from '@/services/mockAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const user = await findUser(email);
    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Return a mock token
    const token = `mock-token-${user.id}`;

    return NextResponse.json({ token, user: { id: user.id, email: user.email } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}
