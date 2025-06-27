import { NextRequest, NextResponse } from 'next/server';

const backendVerifyUrl = `https://3463-2402-e280-230d-3ff-21ca-5fbf-2fce-592c.ngrok-free.app/api/users/protectedRoute`;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Don't run middleware on static files, public folder, or Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like .png or .js
  ) {
    return NextResponse.next();
  }

  // Call backend to verify token
  const verifyRes = await fetch(backendVerifyUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
  });

 if (pathname === '/auth/login') {
  if (verifyRes.ok) {
    const user = await verifyRes.json();
    const dashboardUrl = new URL(`/auth/dashboard/${user.id}`, req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  return NextResponse.next(); // stay on login
}

if (pathname.startsWith('/auth/dashboard')) {
  if (!verifyRes.ok) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
}
}

export const config = {
  matcher: '/:path*', // this matches *all* routes
};



// if user have token check session.