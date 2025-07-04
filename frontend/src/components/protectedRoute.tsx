'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const params = useParams();
  const id = params.id;
  if(id === undefined){
    console.error("ID is undefined, redirecting to login");
    router.replace('/auth/login');
    return null; // Prevent rendering if ID is not available
  }
  const checkForToken = async () => {
    try {
      const news:String|any = process.env.NEXT_PUBLIC_Backend_Verify_Url;
      const res = await fetch(news, {
          method: 'GET',
          credentials: 'include'
        });
          if (res.ok) {
            const user = await res.json();
            if(pathname === '/auth/dashboard/profile'){
              router.replace('/auth/dashboard/profile');
            }
            else if(pathname === `/auth/summary/${id}`){
              router.replace(`/auth/summary/${id}`);}
          }
          if (!res.ok) {
            if(pathname === '/auth/signup'){
                router.replace('/auth/signup');
            }
            else{
              router.replace('/auth/login');
            }
          }
      } catch (error) {
        console.error('Error verifying token:', error);
        //  router.replace('/auth/login'); // on error, redirect to login
      }
      finally{
         setIsLoading(false);
      }
  };

  useEffect(() => {
    checkForToken(); // ✅ run once
  }, []); // ✅ empty deps array prevents loop

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <h1 className="text-3xl font-semibold">Redirecting...</h1>
        <p>If you're not redirected, please <a className="text-blue-500 underline" href="/auth/login">click here</a>.</p>
      </div>
    </div>
    );
  }

  return <>{children}</>;
}
