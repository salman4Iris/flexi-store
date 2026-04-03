import { NextRequest, NextResponse } from "next/server";

type NewsletterRequest = {
  email?: string;
};

type NewsletterResponse = {
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = async (
  request: NextRequest,
): Promise<NextResponse<NewsletterResponse>> => {
  try {
    const body = (await request.json()) as NewsletterRequest;
    const email = body.email?.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed to newsletter" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload" },
      { status: 400 },
    );
  }
};
