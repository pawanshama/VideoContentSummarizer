'use client';
import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react'; // lucide-react icon
import { useRouter } from 'next/navigation';
import { useUpdateUserLoginMutation } from '@/services/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateAuthByPayload } from '@/services/features/counter/auth.state';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({name:'', email: '', password_hash: '' });
  const [updateUserLogin, { isLoading }] = useUpdateUserLoginMutation();

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password_hash) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await updateUserLogin(formData).unwrap();
      // console.log(response,'response response')
      if (response) {
        dispatch(updateAuthByPayload(response?.newUser));
        //@ts-ignore
        
        toast.success('Login successful!');
        router.replace(`/auth/dashboard/${response?.newUser?.id}`);
      }
    } catch (error) {
      // console.error('Login error:', error);
      toast.error((error as any)?.data?.message || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
      const verifyToken = async () => {
        try {
          const smt:String|any = process.env.NEXT_PUBLIC_Backend_Verify_Url;
          const res = await fetch(smt, {
            method: 'GET',
            credentials: 'include',
          });
            if (res.ok) {
              const user = await res.json();
              router.replace(`/auth/dashboard/${user.user.id}`);
            }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      };
     
      verifyToken();
    }, [ router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 p-4">
      <Toaster />
      <main className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <MessageCircle className="text-blue-800 w-8 h-8" />
          <h1 className="text-3xl font-bold text-blue-900">AI Buddy</h1>
        </div>

        <form onSubmit={handleUserSubmit} className="space-y-6">
          <input
            autoComplete='email'
            type="email"
            name="email"
            onChange={handleUserInput}
            placeholder="Email"
            value={formData.email}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            autoComplete='current-password'
            type="password"
            name="password_hash"
            onChange={handleUserInput}
            placeholder="Password"
            value={formData.password_hash}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />  

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-xl hover:bg-green-600 transition-all duration-300"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Account not exists?{' '}
          <span
            onClick={() => router.push('/auth/signup')}
            className="text-blue-700 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </main>
    </div>
  );
}
