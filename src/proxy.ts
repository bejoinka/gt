import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseEnv } from '@/lib/supabase';

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('pathname', pathname);

  // Skip if not an admin route or if it's the public sign-in page
  if (!pathname.startsWith('/admin') || pathname === '/sign-in') {
    return NextResponse.next();
  }

  // Create Supabase client
  const supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  console.log('supabaseResponse', supabaseResponse);

  // Check auth
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Check admin role
  const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return supabaseResponse;
}
