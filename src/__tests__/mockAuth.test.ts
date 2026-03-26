import { clearMockUsers, registerUser, findUser } from '@/services/mockAuth';

describe('mockAuth service', () => {
  beforeEach(async () => {
    await clearMockUsers();
  });

  it('registers and finds a user', async () => {
    const user = await registerUser('a@test.com', 'password');
    expect(user).toBeTruthy();
    const found = await findUser('a@test.com');
    expect(found).toBeTruthy();
    expect(found?.email).toBe('a@test.com');
  });

  it('prevents duplicate registration', async () => {
    const u1 = await registerUser('b@test.com', 'pwd');
    const u2 = await registerUser('b@test.com', 'pwd');
    expect(u1).toBeTruthy();
    expect(u2).toBeNull();
  });
});
