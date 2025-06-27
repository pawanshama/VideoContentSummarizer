'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
import { AuthState } from '@/services/types/Auth';
import { LogOut, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Add this near the top
export default function Sidebar ({ stringfromparent }: { stringfromparent: string }){
  const param = useParams();
  const id = param.id;
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser :AuthState = useAppSelector(state=>state.auth.auth);
  // const [authUser,setAuthUser] = useState<AuthState>(res);
  const handleLogout = async() => {
    try{
      const url:String|any = process.env.NEXT_PUBLIC_LOGOUT_URL;
         const res = await fetch(url,{
           method:"GET",
           credentials: 'include'
         })
         if (res.ok) {
           const user = await res.json();
           router.replace(`/auth/login`);
         }
         if (!res.ok) {
           toast.error("User not Logged out successfully");
         }
    } catch (error) {
      console.error('Error verifying token:', error);
      router.replace('/auth/login'); // on error, redirect to login
    }
    dispatch(clearGetSidebar());
    dispatch(clearVideo());
    dispatch(clearAuth());
    dispatch(clearVideoId());
  };
  // useEffect(()=>{
  //   setAuthUser(res);
  // },[res])

  return (
    <aside
      className={`relative min-h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out
      flex flex-col justify-between ${collapsed ? 'w-[70px]' : `w-full`}`}
    >
      {/* Top - Sidebar Content */}
      <div>
        {/* Collapse Toggle */}
        <div className="flex justify-end p-2 mt-17">
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-blue-500 transition">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom - Profile & Logout */}
        {authUser.name!=''  && 
      <div className="absolute border-t p-4">
          <div className="flex flex-col space-y-2">
            <Link
              href={`/auth/dashboard/${id}/profile`}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
            >
              <UserCircle className="w-5 h-5" />
              {!collapsed && <span>Profile</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
      </div>
        }
    </aside>
  );
};
