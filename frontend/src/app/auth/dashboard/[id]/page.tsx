'use client';
import React,{useEffect, useState} from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'
import FileUpload from '@/components/fileUpload';
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
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
           {/* <ProtectedRoute> */}
            <div className='h-full flex flex-col m-0 p-0 w-full'>
              <div> <Navbar/></div>
              <div className='flex m-0 p-0 w-full h-full'>
                <div className={`flex`}><Sidebar stringfromparent={'w-full'}/>  </div>
                <div className={`flex w-full h-full justify-end `}> <FileUpload/> </div>
              </div>
            </div>
           {/* </ProtectedRoute> */}
     </Provider>
   </ProtectedRoute>
  )
}