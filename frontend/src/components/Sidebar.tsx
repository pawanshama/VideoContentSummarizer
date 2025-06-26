'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
import { LogOut, UserCircle, VideoIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Add this near the top
export default function Sidebar ({ stringfromparent }: { stringfromparent: string }){
  const param = useParams();
  const id = param.id;
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const getUser = sessionStorage.getItem('name')
  console.log(getUser,'getUser')

  const handleLogout = () => {
    dispatch(clearGetSidebar());
    dispatch(clearVideo());
    dispatch(clearAuth());
    dispatch(clearVideoId());
    router.push('/auth/login');
  };


  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out
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
      <div className="border-t p-4">
        {getUser  && (
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
        )}
      </div>
    </aside>
  );
};
