import React from 'react'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/Sidebar'

export default function page() {
  return (
    <div className='h-full flex flex-col m-0 p-0 w-full'>
      <div> <Navbar/></div>
      <div className='flex m-0 p-0 w-full h-full'>
        <div className={`flex w-1/6 h-full justify-center bg-gray-400`}><Sidebar/>  </div>
        <div className={`flex w-5/6 h-full justify-center `}> main </div>
      </div>
    </div>
  )
}
