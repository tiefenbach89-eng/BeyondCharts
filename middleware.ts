import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get user
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect to admin if already logged in and trying to access login
  if (request.nextUrl.pathname === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};