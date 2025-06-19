'use client'
import React, { useState } from 'react'
import { FaFacebookMessenger } from "react-icons/fa";
import getInstance from '@/lib/utility/util';
import { useRouter } from 'next/navigation';

export default function page() {
    const appName = "AI buddy"
    const [formData,setFormData] = useState({email:"",password_hash:""});
    const router = useRouter();

    const handleUserInput = (event:React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const {name,value}= event.target
        setFormData(prev=>({...prev,[name]:value}));
    }
    const handleUserSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
        try{
              const response = await getInstance.post('/api/users/login',formData)
              .then(data=>{
                console.log(data)
                router.replace('/auth/dashboard');
              })
              .catch((error)=>console.log(error))
        }
        catch(error){
              console.log("Error in login page.Handle it correctly",error)
        }
    }
  return (
    <div className='w-full box-border m-0 p-0'>
      <main className=' flex flex-col lg:w-1/2 md:w-2/3 w-full lg:h-3/4 md:h-5/6 h-3/4 bg-sky-50 text-black rounded-2xl'>
          <div className='flex flex-row mt-10 '>
              <FaFacebookMessenger className='text-3xl mt-0.5'/>
              <div className='text-3xl text-blue-900 '>{appName}</div>
          </div>

          <form className='flex flex-col w-1/3 sm:w-full h-200 bg-sky-50 text-black mt-12' onSubmit={handleUserSubmit}>
            {/* <div className='flex m-8 font-medium justify-center'>
              
              <input onChange={(e)=>handleUserInput(e)} placeholder='    name ' type='text' name='Username' className='w-100 h-10 border-1 rounded-xl'/>
            </div> */}
            <div className='flex m-8 font-medium justify-center'>
              {/* <label className='flex text-2xl mr-2 justify-center'> Email</label> */}
              <input placeholder='    email' type='email' name='email' className='w-100 h-10 border-1 rounded-xl'/>
            </div>
            <div className='flex m-8 font-medium justify-center'>
              {/* <label className='flex text-2xl mr-2 justify-center'> Password </label> */}
              <input placeholder='   fill password ' type='password' name='password_hash' className='w-100 h-10 border-1 rounded-xl '/>
            </div>
            <div className='flex m-8 justify-center'>
               <button type='submit' className='text-2xl bg-green-400 w-1/3 h-10 rounded-3xl justify-center items-center'>Sign In</button>
            </div>
          </form>
      </main>
    </div>
  )
}
