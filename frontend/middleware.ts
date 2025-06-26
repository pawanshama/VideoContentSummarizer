// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const backendVerifyUrl = `https://your-ngrok-id.ngrok-free.app1` + '/api/users/protectedRoute';
// console.log("i am inside middleware");
export async function middleware(req: NextRequest) {
  const publicPaths = ["/auth/login", "/auth/signup"];
  const pathname = req.nextUrl.pathname;
  // console.log(pathname);
  // Allow access to public paths
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Send request to backend to validate token
    try{

      const verifyRes = await fetch(backendVerifyUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          cookie: req.headers.get('cookie') || '',
        }
      });
      
      if (verifyRes.ok) return NextResponse.next();
    }
    catch(error){
      console.error('Middleware error verifying token:', error);
    }
      
  // If not authenticated, redirect to login
  const loginUrl = new URL('/auth/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/','/auth/login','/login','/dashboard/:path*', '/profile/:path*', '/admin/:path*'], // secure these
};
