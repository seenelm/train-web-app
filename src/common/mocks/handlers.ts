// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({ user: { email } });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),
];