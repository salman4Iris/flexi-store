import fs from 'fs/promises';
import path from 'path';

type OrderItem = { id: string; name: string; price: number; qty: number };
type Order = { id: string; userId: string; items: OrderItem[]; total: number; createdAt: string };

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readOrders(): Promise<Order[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeOrders(list: Order[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export async function createOrder(userId: string, items: OrderItem[], total: number) {
  const orders = await readOrders();
  const id = `order_${orders.length + 1}`;
  const order: Order = { id, userId, items, total, createdAt: new Date().toISOString() };
  orders.push(order);
  await writeOrders(orders);
  return order;
}

export async function listOrders(userId: string) {
  const orders = await readOrders();
  return orders.filter((o) => o.userId === userId);
}

export async function clearOrders() {
  await writeOrders([]);
}
