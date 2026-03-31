import fs from "fs/promises";
import path from "path";

type UserRecord = { email: string; password: string; id: string };

const DATA_DIR = path.join(process.cwd(), "src", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const ensureDataDir = async (): Promise<void> => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Silently fail if directory already exists
  }
};

const readUsers = async (): Promise<UserRecord[]> => {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
};

const writeUsers = async (users: UserRecord[]): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
};

type UserResponse = { id: string; email: string };

export const registerUser = async (
  email: string,
  password: string
): Promise<UserResponse | null> => {
  const users = await readUsers();
  const existingUser = users.find((u) => u.email === email);
  
  if (existingUser) {
    return null;
  }
  
  const id = `user_${users.length + 1}`;
  const newUser: UserRecord = { email, password, id };
  users.push(newUser);
  await writeUsers(users);
  
  return { id: newUser.id, email: newUser.email };
};

export const findUser = async (email: string): Promise<UserRecord | null> => {
  const users = await readUsers();
  return users.find((u) => u.email === email) ?? null;
};

export const clearMockUsers = async (): Promise<void> => {
  await writeUsers([]);
};
