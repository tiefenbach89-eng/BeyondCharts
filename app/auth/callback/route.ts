// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') ?? '/konto';

  console.log('🔍 Auth Callback Debug:');
  console.log('   URL:', requestUrl.toString());
  console.log('   Code:', code ? 'EXISTS' : 'MISSING');
  console.log('   Token Hash:', token_hash ? 'EXISTS' : 'MISSING');
  console.log('   Type:', type);

  // Handle PKCE code flow
  if (code) {
    console.log('✅ PKCE Flow detected');
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('❌ Exchange failed:', error.message);
      return NextResponse.redirect(new URL(`/login?error=${error.message}`, requestUrl.origin));
    }

    if (data.session) {
      console.log('✅ Session created for:', data.user?.email);
      // If this is from email confirmation, add confirmed parameter
      const redirectUrl = new URL(next, requestUrl.origin);
      if (type === 'email') {
        redirectUrl.searchParams.set('confirmed', 'true');
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle old token_hash flow (fallback)
  if (token_hash && type) {
    console.log('⚠️ Old token_hash flow detected');
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (error) {
      console.error('❌ Token verify failed:', error.message);
      return NextResponse.redirect(new URL(`/login?error=${error.message}`, requestUrl.origin));
    }

    console.log('✅ Token verified');
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  console.error('❌ No code or token_hash found');
  return NextResponse.redirect(new URL('/login?error=no_auth_code', requestUrl.origin));
}