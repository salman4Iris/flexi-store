import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/services/orders';

type OrderItem = { id: string; name: string; price: number; qty: number };

const extractUserIdFromAuth = (header?: string | null): string | null => {
  if (!header) return null;
  const m = header.match(/Bearer\s+mock-token-(.+)$/);
  return m ? m[1] : null;
};

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization');
    const userId = extractUserIdFromAuth(auth);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { items, total } = body as { items?: OrderItem[]; total?: number };
    if (!Array.isArray(items) || typeof total !== 'number') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const order = await createOrder(userId, items, total);
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  const userId = extractUserIdFromAuth(auth);
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const data = await listOrders(userId);
  return NextResponse.json(data);
}
