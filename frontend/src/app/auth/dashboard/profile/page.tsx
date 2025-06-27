'use client';
import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import Profile from '@/components/profile';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import ProtectedRoute from '@/components/protectedRoute';

export default function page() {
      const [loading, setLoading] = useState(true);
      const router = useRouter();
       useEffect(() => {
           async function checkAuth() {
             try {
               const ns:string | any = process.env.NEXT_PUBLIC_Backend_Verify_Url
               const res = await fetch(ns, {
                 method: 'GET', credentials: 'include', });
       
               if (!res.ok) {
                 router.push('/auth/login');
               } else {
                 setLoading(false);
               }
             } catch (error) {
               console.log("error in [id].page",error);
               router.push('/auth/login');
             }
           }
           checkAuth();
      }, [router]);

  if (loading) {
    return <ClipLoader loading={loading} size={50}/>;
  }       
  return (
    <ProtectedRoute>
      <Provider store={store}>
          <Profile/>
      </Provider>
    </ProtectedRoute>
  )
}
