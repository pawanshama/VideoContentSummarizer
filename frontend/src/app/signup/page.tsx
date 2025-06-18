import React from 'react'
import { FaFacebookMessenger } from "react-icons/fa";

export default function page() {
  return (
    <div className='box-border m-0 p-0'>
      <main className='flex flex-col w-150 h-200 bg-sky-50 text-black rounded-2xl'>
          <div className='flex flex-row mt-10 '>
              <FaFacebookMessenger className='text-3xl mt-0.5'/>
              <div className='text-3xl text-blue-900 '>logo-AI-logo</div>
          </div>

          <form className='flex flex-col w-100 h-200 bg-sky-50 text-black'>
            <div className=' m-9 p-2 font-medium'>
              <label className= 'flex text-2xl mr-2 justify-center'> Name</label>
              <input placeholder='Name' type='text' name='' className='w-100 border-1 rounded-sm'/>
            </div>
            <div className=' m-9 p-2 font-medium'>
              <label className='flex text-2xl mr-2 justify-center'> Email</label>
              <input placeholder='Email' type='email' name='' className='w-100 border-1 rounded-sm'/>
            </div>
            <div className=' m-9 p-2 font-medium'>
              <label className='flex text-2xl mr-2 justify-center'> Password </label>
              <input placeholder='Password' type='password' name='' className='w-100 border-1 rounded-sm '/>
            </div>
            <div>
               <button type='submit' className='text-2xl bg-green-400 w-30 h-8 rounded-3xl justify-center items-center'>Sign In</button>
            </div>
          </form>
      </main>
    </div>
  )
}
