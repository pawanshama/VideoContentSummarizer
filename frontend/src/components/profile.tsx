'use client';

import React, { useState } from 'react';
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
                src={selectedImg || '@public/profile.png'}
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