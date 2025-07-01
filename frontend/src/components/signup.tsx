'use client';

import React, { useState} from 'react';
import { MessageCircleMore } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useUpdateUserMutation } from '@/services/api';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password_hash: '' });
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password_hash) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await updateUser(formData).unwrap();
      if (response) {
        toast.success('Signup successful! Redirecting...');
        setTimeout(() => router.push('/auth/login'), 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 p-4">
      <Toaster position="top-right" />
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MessageCircleMore className="text-blue-700 w-8 h-8" />
          <h1 className="text-3xl font-bold text-blue-900">AI Buddy - Sign Up</h1>
        </div>

        <form onSubmit={handleUserSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            onChange={handleUserInput}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            onChange={handleUserInput}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password_hash"
            onChange={handleUserInput}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-xl hover:bg-green-600 transition-all duration-300"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => router.push('/auth/login')}
            className="text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
