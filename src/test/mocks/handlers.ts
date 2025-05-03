import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json(
        { user: { id: 1, email } },
        { status: 200 }
      );
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Mock Google sign-in endpoint
  http.post('/api/auth/google', () => {
    return HttpResponse.json(
      { user: { id: 1, email: 'google@example.com' } },
      { status: 200 }
    );
  }),
]; 