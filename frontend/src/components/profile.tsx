'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Mail, User, CalendarCheck } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import toast, { Toaster } from 'react-hot-toast';

export default function Profile() {
  const authUser = useAppSelector((state) => state.auth.auth);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const imageURL = URL.createObjectURL(file);
    setSelectedImg(imageURL);
    toast.success('Image selected!');
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-sky-100 to-blue-100">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-500 mt-1">Manage your profile information</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={selectedImg || '/avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer transition-all"
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">Click the camera icon to change your photo</p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 border">{authUser?.name}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2 bg-gray-100 rounded-md text-gray-800 border">{authUser?.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Member Since
                </span>
                <span className="text-gray-800">
                  {authUser?.created_at ? authUser.created_at.split('T')[0] : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




// 'use client'
// import getInstance from '@/lib/utility/util'
// import { BackedupState } from '@/services/types/Auth';
// import { Camera, Mail, User } from "lucide-react";
// import React,{useEffect, useState} from 'react'
// import toast from 'react-hot-toast'
// import { useAppDispatch,useAppSelector } from '@/lib/redux/hooks';
// import { getSidebar } from '@/services/features/counter/auth.state';
// import { useLazyGetUserQuery } from '@/services/api';

// export default function Profile() {
//     const authUser  = useAppSelector((state)=>state.auth.auth);
//     console.log(authUser);
//     const [selectedImg,setSelectedImg]= useState<File|null>(null);
//     const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
//       const file : File|null = e.target?.files?.[0] ||null;
//       if (!file) return;
//     };
    
//   return (
//     <div className="h-screen pt-20">
//       <div className="max-w-2xl mx-auto p-4 py-8">
//         <div className="bg-base-300 rounded-xl p-6 space-y-8">
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold ">Profile</h1>
//             <p className="mt-2">Your profile information</p>
//           </div>

//           {/* avatar upload section */}

//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <img
//                 src={selectedImg || "/avatar.png"}
//                 alt="Profile"
//                 className="size-32 rounded-full object-cover border-4 "
//               />
//               <label
//                 htmlFor="avatar-upload"
//                 className={`
//                   absolute bottom-0 right-0 
//                   bg-base-content hover:scale-105
//                   p-2 rounded-full cursor-pointer 
//                   transition-all duration-200
//                   ${ "animate-pulse pointer-events-none"}
//                 `}
//               >
//                 <Camera className="w-5 h-5 text-base-200" />
//                 <input
//                   type="file"
//                   id="avatar-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={false}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-zinc-400">
//               { "Click the camera icon to update your photo"}
//             </p>
//           </div>

//           <div className="space-y-6">
//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Full Name
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.name}</p>
//             </div>

//             <div className="space-y-1.5">
//               <div className="text-sm text-zinc-400 flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Email Address
//               </div>
//               <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
//             </div>
//           </div>

//           <div className="mt-6 bg-base-300 rounded-xl p-6">
//             <h2 className="text-lg font-medium  mb-4">Account Information</h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex items-center justify-between py-2 border-b border-zinc-700">
//                 <span>Member Since</span>
//                 <span>{authUser.created_at?.split("T")[0]}</span>
//               </div>
//               <div className="flex items-center justify-between py-2">
//                 <span>Account Status</span>
//                 <span className="text-green-500">Active</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // const ProfilePage = () => {
// //   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
// //   const [selectedImg, setSelectedImg] = useState(null);


// //   return (
   
// //   );
// // };
// // export default ProfilePage;


// // src/components/ProfilePage.tsx
// // 'use client';

// // import React from 'react';
// // import { Edit, Mail, UserCircle } from 'lucide-react';
// // import toast, { Toaster } from 'react-hot-toast';

// // export default function ProfilePage() {
// //   const handleEdit = () => {
// //     toast.success('Edit Profile Clicked!');
// //   };

// //   const user = {
// //     name: 'Pawan Sharma',
// //     email: 'pawan@example.com',
// //     avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Pawan',
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100">
// //       <Toaster position="top-right" />
// //       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
// //         <img
// //           src={user.avatar}
// //           alt="Profile"
// //           className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-400"
// //         />
// //         <h2 className="text-2xl font-semibold flex justify-center items-center gap-2">
// //           <UserCircle className="w-6 h-6 text-indigo-600" />
// //           {user.name}
// //         </h2>
// //         <p className="text-gray-500 flex justify-center items-center gap-2 mt-2">
// //           <Mail className="w-4 h-4" />
// //           {user.email}
// //         </p>

// //         <button
// //           onClick={handleEdit}
// //           className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center gap-2 transition"
// //         >
// //           <Edit className="w-5 h-5" />
// //           Edit Profile
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
