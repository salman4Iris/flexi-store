import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MOCK_USERS: Record<
  string,
  { id: string; email: string; name: string }
> = {
  "google-user@example.com": {
    id: "google-001",
    email: "user@gmail.com",
    name: "Google User",
  },
  "linkedin-user@example.com": {
    id: "linkedin-001",
    email: "user@linkedin.com",
    name: "LinkedIn User",
  },
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as {
      email?: string;
      name?: string;
      provider?: string;
      image?: string;
    };
    const { email, name, provider } = body;

    if (!email || !provider) {
      return NextResponse.json(
        { message: "Missing email or provider" },
        { status: 400 }
      );
    }

    // Find or create user based on email
    let user = MOCK_USERS[email];
    if (!user) {
      const userId = `${provider}-${Date.now()}`;
      user = {
        id: userId,
        email,
        name: name || email.split("@")[0],
      };
      MOCK_USERS[email] = user;
    }

    // Generate a mock token for social login
    const token = `mock-${provider}-token-${user.id}`;

    return NextResponse.json(
      { token, user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "OAuth callback error" },
      { status: 400 }
    );
  }
}
