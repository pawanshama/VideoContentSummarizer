'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  // console.log(pathname);
  const checkForToken = async () => {
    try {
      const news:String|any = process.env.NEXT_PUBLIC_Backend_Verify_Url;
      const res = await fetch(news, {
          method: 'GET',
          credentials: 'include'
        });
          if (res.ok) {
            const user = await res.json();
            if(pathname === '/auth/dashborad/profile'){
              router.replace('/auth/dashboard/profile');
            }
            // router.replace(`/auth/dashboard/${user.user.id}`);
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
         router.replace('/auth/login'); // on error, redirect to login
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












// // 'use client';
// // import getInstance from '@/lib/utility/util';
// // import { useRouter } from 'next/navigation';
// // import React,{useEffect, useState} from 'react'
// // import toast from 'react-hot-toast';

// // export default function ProtectedRoute({ children }: { children: React.ReactNode }) { 
// //     const router = useRouter(); 
// //     const [isLoading,setIsLoading] = useState<boolean>(true);
// //     const checkForToken = async()=>{
// //         try{
// //             const response = await getInstance.get("/api/users/protectedRoute")
// //             console.log(response);
// //             if(!response.data){
// //                 setIsLoading(false)
// //                 router.replace("/auth/login");
// //             }
// //         }
// //         catch(error){
// //             setIsLoading(false);
// //             router.replace("/auth/login");
// //             toast.error("You are authorised.Please Sign In");
// //         }
// //     }
// //     useEffect(()=>{
// //        checkForToken();
// //     },[])
// //   return (
// //     <>
// //     {!isLoading && children}
// //     </>
// //   )
// // }

// // 'use client';
// // import React from 'react';
// // import { Provider } from 'react-redux';
// // import { store } from '@/services/store/store';

// // export function ReduxProvider({ children }: { children: React.ReactNode }) {
// //   return <Provider store={store}>{children}</Provider>;
// // }
