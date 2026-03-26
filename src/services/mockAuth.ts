import fs from 'fs/promises';
import path from 'path';

type UserRecord = { email: string; password: string; id: string };

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readUsers(): Promise<UserRecord[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function registerUser(email: string, password: string) {
  const users = await readUsers();
  if (users.find((u) => u.email === email)) return null;
  const id = `user_${users.length + 1}`;
  const u: UserRecord = { email, password, id };
  users.push(u);
  await writeUsers(users);
  return { id: u.id, email: u.email };
}

export async function findUser(email: string) {
  const users = await readUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function clearMockUsers() {
  await writeUsers([]);
}
