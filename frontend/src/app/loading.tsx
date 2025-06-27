'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const backendVerifyUrl = `http://localhost:8001/api/users/protectedRoute`;

export default function CatchAll() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const news:string|any = process.env.NEXT_PUBLIC_Backend_Verify_Url;
        const res = await fetch(news, {
          method: 'GET',
          credentials: 'include',
        });
          if (res.ok) {
            const user = await res.json();
            router.replace(`/auth/dashboard/${user.user.id}`);
          }
          if (!res.ok) {
            router.replace('/auth/login');
          }
      } catch (error) {
        console.error('Error verifying token:', error);
        router.replace('/auth/login'); // on error, redirect to login
      }
    };

    verifyToken();
  }, [pathname, router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <h1 className="text-3xl font-semibold">Redirecting...</h1>
        <p>If you're not redirected, please <a className="text-blue-500 underline" href="/auth/login">click here</a>.</p>
      </div>
    </div>
  );
}
