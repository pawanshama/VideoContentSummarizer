'use client';
import React from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'
import FileUpload from '@/components/fileUpload';
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import ProtectedRoute from '@/components/protectedRoute';
export default function page() {
  return (
    <Provider store={store}>
           <ProtectedRoute>
            <div className='h-full flex flex-col m-0 p-0 w-full'>
              <div> <Navbar/></div>
              <div className='flex m-0 p-0 w-full h-full'>
                <div className={`flex`}><Sidebar stringfromparent={'w-1/4'}/>  </div>
                <div className={`flex w-5/6 h-full justify-center `}> <FileUpload/> </div>
              </div>
            </div>
           </ProtectedRoute>
    </Provider>
  )
}
