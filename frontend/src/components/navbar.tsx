'use client'
import React,{useEffect, useState} from 'react';
import {MessageSquare} from 'lucide-react';
import { useAppSelector,useAppDispatch } from '@/lib/redux/hooks';
import { AuthState } from '@/services/types/Auth';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId, updateAuthByPayload } from '@/services/features/counter/auth.state';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Navbar() {
  const appName = 'AI buddy';
  const res:AuthState = useAppSelector(state=>state.auth.auth);
  const [authUser,setAuthUser] = useState<AuthState>(res);
  const param = useParams();
  const id:string|any = param.id;
  const dispatch = useAppDispatch();

  useEffect(()=>{
    const functionToFetchAuth = async()=>{
      try{
        const url:string|any = process.env.NEXT_PUBLIC_GETUSER_URL + `${id}`;
         const res = await fetch(url,{
             method:"GET",
             credentials: 'include'
         })

         if(res.ok){
            const response = await res.json();
            dispatch(updateAuthByPayload(response.user));
         }
      }
      catch(error){
        console.log("no auth user",error);
      }
    }
    if(authUser.name.trim() === ''){
      functionToFetchAuth();
      setAuthUser(res);
    }
  },[res])
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
  <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
    
    {/* Logo Section */}
    <Link
      href="/"
      className="flex items-center gap-2 text-blue-900 font-bold hover:opacity-80 transition-all"
    >
      <div className="p-2 bg-blue-100 rounded-md">
        <MessageSquare className="w-5 h-5 text-blue-600" />
      </div>
      <span className="text-xl font-semibold tracking-tight">
        {appName}
      </span>
    </Link>

    {/* Right-side Auth User */}
    {authUser.name !='' && (
      <div className="flex items-center gap-4">
        <span className="text-md font-medium px-4 py-1 rounded-lg bg-gray-100">
          {authUser.name}
        </span>
      </div>
    )
    }
  </div>
</header>
  );
}