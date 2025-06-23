
'use client';

import React from 'react';
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react';
import { useAppSelector,useAppDispatch } from '@/lib/redux/hooks';
import { AuthState } from '@/services/types/Auth';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const appName = 'AI buddy';
  const authUser: AuthState = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 text-blue-900 font-bold hover:opacity-80 transition-all">
            <div className="p-2 bg-blue-100 rounded-md">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-semibold tracking-tight">{appName}</span>
          </Link>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {authUser && (
              <>
                <Link
                  href="/auth/dashboard/profile"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                  >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all"
                  onClick={() => {
                    // TODO: dispatch logout action here
                    console.log('Logout clicked');
                    dispatch(clearAuth());
                    dispatch(clearGetSidebar());
                    dispatch(clearVideo());
                    dispatch(clearVideoId());
                    router.replace('/auth/login');
                  }}
                  >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span className="hidden sm:inline text-red-600">Logout</span>
                </button>
              </>
            )}

            <Link
              href="/settings"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
              >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// 'use client'
// import React from 'react'
// import { LogOut, MessageSquare, PlusCircle, Settings, User, UserCheck, UserPlus } from "lucide-react";
// import Link from 'next/link'
// import { useAppSelector } from '@/lib/redux/hooks';
// import { AuthState } from '@/services/types/Auth';
// export default function Navbar() {
//     const appName = "AI buddy"
//     const authUser:AuthState = useAppSelector((state)=>state.auth.auth);
//   return (
//      <header
//       className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
//     backdrop-blur-lg bg-base-100/80"
//     >
//       <div className="container mx-auto px-4 h-16">
//         <div className="flex items-center justify-between h-full">
//           <div className="flex items-center gap-8">
//             <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
//               <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
//                 <MessageSquare className="w-5 h-5 text-primary" />
//               </div>
//               <h1 className="text-lg font-bold">AlIgN</h1>
//             </Link>
//           </div>

//           <div className="flex items-center gap-2">

//             {authUser && (
//                     <>                      
//                       <Link href={"/auth/dashboard/profile"} className={`btn btn-sm gap-2 ml-3`}>
//                         <User className="size-5" />
//                         <span className="hidden sm:inline">Profile</span>
//                       </Link>

//                       <button className="flex gap-2 items-center ml-3" >
//                         <LogOut className="size-5" />
//                         <span className="hidden sm:inline">Logout</span>
//                       </button>
//                     </>
//               )}
//             <Link
//               href={"/settings"}
//               className={`
//               btn btn-sm gap-2 transition-colors
              
//               `}
//             >
//               <Settings className="w-4 h-4 ml-3" />
//               <span className="hidden sm:inline">Settings</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

import Link from 'next/link';