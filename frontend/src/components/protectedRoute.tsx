// frontend: /middleware.ts
import { useParams } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const isPublicPath = ["/", "/login", "/register"].includes(req.nextUrl.pathname);
  const backendURL = "http://localhost:8001";

  if (isPublicPath) return NextResponse.next();
  const param = useParams();
  const id:any = param.id;
  // Try validating token by pinging backend
  const verifyResponse = await fetch(`${backendURL}/api/users/protectedRoute`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
  });

  if (verifyResponse.ok) {
    return NextResponse.next(); // Token is valid
  }

  // Redirect to login if invalid
  return NextResponse.redirect(new URL("/login", req.url));
}

// Protect these routes only
export const config = {
  matcher: ["/dashboard", `/dashboard/:*`, "/profile", "/admin/:path*"],
};





// 'use client';
// import { useAppSelector } from '@/lib/redux/hooks';
// import getInstance from '@/lib/utility/util';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const id = useAppSelector(state=>state.auth.auth.id);
//   const checkForToken = async () => {
//     try {
//       const response = await getInstance.get(`/api/users/protectedRoute/${id}`, {
//         withCredentials: true, // ✅ ensure cookies are sent
//       });

//       if (!response?.data) {
//         router.replace('/auth/login');
//         toast.error('Unauthorized. Please sign in.');
//       }
//       else{
//         console.log(id);
//         router.replace(`/auth/dashboard/${id}`)
//       }
//     } catch (error) {
//       // router.replace('/auth/login');
//       // toast.error('You are unauthorized. Please sign in.');
//     } finally {
//       setIsLoading(false); // ✅ always stop loading
//     }
//   };

//   useEffect(() => {
//     checkForToken(); // ✅ run once
//   }, []); // ✅ empty deps array prevents loop

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-500">Checking authentication...</p>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }












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
