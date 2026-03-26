// Basic smoke tests for mock auth and orders API
import fetch from 'node-fetch';

async function run() {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  console.log('Using base URL', base);

  // register
  let r = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'tester@example.com', password: 'password' }),
  });
  console.log('/api/auth/register', r.status);

  r = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'tester@example.com', password: 'password' }),
  });
  const login = await r.json();
  console.log('/api/auth/login', r.status, login);

  const token = login.token;
  if (!token) return console.error('no token; aborting');

  // create order
  r = await fetch(`${base}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ items: [{ id: 'product-1', name: 'Test', price: 10, qty: 1 }], total: 10 }),
  });
  console.log('/api/orders POST', r.status, await r.json());

  // list orders
  r = await fetch(`${base}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('/api/orders GET', r.status, await r.json());
}

run().catch((e) => { console.error(e); process.exit(1); });
