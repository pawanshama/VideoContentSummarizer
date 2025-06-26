
'use client'
import React,{useEffect} from 'react';
import {MessageSquare} from 'lucide-react';
import { useAppSelector,useAppDispatch } from '@/lib/redux/hooks';
import { AuthState } from '@/services/types/Auth';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Navbar() {
  const appName = 'AI buddy';
    const getUser = sessionStorage.getItem('name');
  console.log(getUser)
  const dispatch = useAppDispatch();
  // const router = useRouter();
  useEffect(()=>{
      
  },[])
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
    {getUser && (
      <div className="flex items-center gap-4">
        <span className="text-md font-medium px-4 py-1 rounded-lg bg-gray-100">
          {getUser}
        </span>
        {/* Optional: Add a profile image or dropdown menu later here */}
      </div>
    )}
  </div>
</header>
  );
}