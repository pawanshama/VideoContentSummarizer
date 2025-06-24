// 'use client'

// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { getSidebar, updateVideoByPayload } from '@/services/features/counter/auth.state';
// import { useLazyGetUserQuery, useLazyGetVideoSummaryQuery } from '@/services/api';
// import { summarState } from '@/services/types/Auth';
// import { VideoIcon, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function Sidebar({ stringfromparent }: { stringfromparent: string }) {
//   const [userList, setUserList] = useState<summarState[]>([]);
//   const [collapsed, setCollapsed] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dispatch = useAppDispatch();
//   const id = useAppSelector((state) => state.auth.auth.id);
//   const [getUser, { isFetching }] = useLazyGetUserQuery();
//   const [getVideoSummary, { isLoading, isError, isSuccess }] = useLazyGetVideoSummaryQuery();
//   const data = useAppSelector((state) => state.videoId.videoUpload);
//   const router = useRouter();

//   const fetchUserData = async () => {
//     try {
//       const response: any = await getUser(id).unwrap();
//       if (response?.summary) {
//         setUserList(response?.summary);
//         dispatch(getSidebar(response?.summary));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const videoIdHandleFunction = async (index: number) => {
//     try {
//       const videoId = userList[index].id;
//       const response = await getVideoSummary(videoId);
//       if (isSuccess && response?.data) {
//         dispatch(updateVideoByPayload(response.data));
//         toast.success("Summary fetched");
//       } else {
//         toast.error("Summary not fetched");
//       }
//     } catch (error) {
//       toast.error("Unable to fetch this video Summary");
//     }
//   };

//   const handleLogout = () => {
//     // clear token/cookies/localStorage
//     localStorage.clear(); // or cookie remove logic
//     router.replace('/auth/login');
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, [data]);

//   return (
//     <aside
//       className={`relative mt-17 h-screen bg-white border-r border-gray-200 shadow-sm 
//         transition-all duration-300 ease-in-out 
//         ${collapsed ? 'w-[70px]' : 'w-[280px]'} 
//         ${stringfromparent}`}
//     >
//       {/* Toggle Collapse Button */}
//       <div className="flex justify-between items-center p-2 px-3">
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-gray-500 hover:text-blue-500 transition"
//         >
//           {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//         </button>

//         {/* Profile Circle */}
//         <div className="relative">
//           <div
//             onClick={() => setShowDropdown((prev) => !prev)}
//             className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-600"
//             title="Account"
//           >
//             {/* Replace with initials or avatar logic */}
//             <span>P</span>
//           </div>

//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
//               <button
//                 onClick={() => router.push('/auth/profile')}
//                 className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
//               >
//                 <User size={16} /> Profile
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
//               >
//                 <LogOut size={16} /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Sidebar Header */}
//       {!collapsed && (
//         <div className="px-4 mb-4">
//           <h2 className="text-md font-semibold text-gray-800">Uploaded Videos</h2>
//           <p className="text-sm text-gray-500">Your recent uploads</p>
//         </div>
//       )}

//       {/* List */}
//       <div className="px-2 space-y-2 overflow-y-auto h-[85%] scrollbar-thin">
//         {isFetching && (
//           <div className="text-center text-sm text-gray-500 animate-pulse">Loading...</div>
//         )}

//         {!isFetching && userList.length > 0 ? (
//           userList.map((item, index) => (
//             <div
//               key={index}
//               className={`flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-blue-100
//               cursor-pointer transition-all group ${collapsed ? 'justify-center' : ''}`}
//               onClick={() => videoIdHandleFunction(index)}
//             >
//               <VideoIcon className="w-5 h-5 text-blue-600" />
//               {!collapsed && (
//                 <span className="text-sm text-gray-800 truncate">{item.summary_text}</span>
//               )}
//             </div>
//           ))
//         ) : (
//           !isFetching && (
//             <div className="text-sm text-gray-400 text-center mt-12">
//               No videos found.
//             </div>
//           )
//         )}
//       </div>
//     </aside>
//   );
// }


import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
import { LogOut, UserCircle, VideoIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Add this near the top
export default function Sidebar ({ stringfromparent }: { stringfromparent: string }){
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userList = useAppSelector(state=>state.backedFile.summar);
  const authUser = useAppSelector((state) => state.auth.auth); // assuming you store user info here

  const handleLogout = () => {
    dispatch(clearGetSidebar());
    dispatch(clearVideo());
    dispatch(clearAuth());
    dispatch(clearVideoId());
    router.push('/auth/login');
  };

  function videoIdHandleFunction(index: any): void {
    throw new Error('Function not implemented.');
  }

  return (
    <aside
      className={`mt-17 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out
      flex flex-col justify-between ${collapsed ? 'w-[70px]' : 'w-[280px]'} ${stringfromparent}`}
    >
      {/* Top - Sidebar Content */}
      <div>
        {/* Collapse Toggle */}
        <div className="flex justify-end p-2">
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-blue-500 transition">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Header */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <h2 className="text-md font-semibold text-gray-800">Uploaded Videos</h2>
            <p className="text-sm text-gray-500">Your recent uploads</p>
          </div>
        )}

        {/* Video List */}
        <div className="px-2 space-y-2 overflow-y-auto h-[calc(100vh-220px)] scrollbar-thin">
          {userList.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-blue-100 cursor-pointer
              ${collapsed ? 'justify-center' : ''}`}
              onClick={() => videoIdHandleFunction(index)}
            >
              <VideoIcon className="w-5 h-5 text-blue-600" />
              {!collapsed && <span className="text-sm text-gray-800 truncate">{item.summary_text}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom - Profile & Logout */}
      <div className="border-t p-4">
        {authUser && (
          <div className="flex flex-col space-y-2">
            <Link
              href="/profile"
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
function logoutAction(): any {
  throw new Error('Function not implemented.');
}

