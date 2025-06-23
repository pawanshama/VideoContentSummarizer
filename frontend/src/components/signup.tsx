// "use client"
// import React , { useState,useEffect } from 'react'
// import { FaFacebookMessenger } from "react-icons/fa";
// import { useRouter } from 'next/navigation';
// import { updateVideoByPayload, updateVideoIdByPayload, updateAuthByPayload } from '@/services/features/counter/auth.state'
// import { useUpdateUserMutation } from '@/services/api';
// import { useAppDispatch,useAppSelector } from '@/lib/redux/hooks';
// import toast from 'react-hot-toast';

// export default function Signup() {
//   const appName = "AI buddy"
//     const [formData,setFormData] = useState({name:"",email:"",password_hash:""});
//     // const [debouncedFormData,setDebouncedFormData] = useState(formData);
//     const dispatch = useAppDispatch();
//     const router = useRouter();
//     const [updateUser,{isError,isLoading,isSuccess}]= useUpdateUserMutation();
//     // console.log(data);
//     const auth = useAppSelector((state)=>state.auth);
//     // console.log(auth);
    
//     const handleUserInput = (event:React.ChangeEvent<HTMLInputElement>) => {
//       event.preventDefault();
//       const {name,value}= event.target
//       // console.log(name,value);
//       setFormData(prev=>({...prev,[name]:value}));
//     }
//     const handleUserSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
//       e.preventDefault();
//       try{
//         // console.log(formData);
//         const response = await updateUser(formData);
//         if(response.data){
//           // dispatch(updateAuthByPayload(response.data));
//           toast("query passed");
//           router.push('auth/login');
//           // console.log(auth);
//         }
//         else{
//           toast("query failed");
//         }
//       }
//       catch(error){
//         console.log("Handle error correctly in signup.",error);
//       }
//     }
//     useEffect(()=>{
//       console.log(auth.auth);
//     },[auth])

//   return (
//     // <Provider store={store}>
//       <div className='w-full box-border m-0 p-0'>
//         <main className='mt flex flex-col lg:w-1/2 md:w-2/3 w-full lg:h-3/4 md:h-5/6 h-3/4 bg-sky-50 text-black rounded-2xl'>
//             <div className='flex flex-row mt-10 '>
//                 <FaFacebookMessenger className='text-3xl mt-0.5'/>
//                 <div className='text-3xl text-blue-900 '>{appName}</div>
//             </div>

//             <form className='flex flex-col w-1/3 sm:w-full h-200 bg-sky-50 text-black mt-12' onSubmit={handleUserSubmit}>
//               <div className='flex m-8 font-medium justify-center'>
//                 {/* <label className= 'flex text-2xl mr-2 justify-center'> Name </label> */}
//                 <input onChange={(e)=>handleUserInput(e)} placeholder='    name ' type='text' name='name' className='w-100 h-10 border-1 rounded-xl'/>
//               </div>
//               <div className='flex m-8 font-medium justify-center'>
//                 {/* <label className='flex text-2xl mr-2 justify-center'> Email</label> */}
//                 <input onChange={(e)=>handleUserInput(e)} placeholder='    email' type='email' name='email' className='w-100 h-10 border-1 rounded-xl'/>
//               </div>
//               <div className='flex m-8 font-medium justify-center'>
//                 {/* <label className='flex text-2xl mr-2 justify-center'> Password </label> */}
//                 <input onChange={(e)=>handleUserInput(e)} placeholder='   fill password ' type='password' name='password_hash' className='w-100 h-10 border-1 rounded-xl '/>
//               </div>
//               <div className='flex m-8 justify-center'>
//                 <button type='submit' className='text-2xl bg-green-400 w-1/3 h-10 rounded-3xl justify-center items-center'>Sign Up</button>
//               </div>
//             </form>
//         </main>
//       </div>
//     //</Provider>
//   )
// }


'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useUpdateUserMutation } from '@/services/api';
// import { updateAuthByPayload } from '@/services/features/counter/auth.state';

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', password_hash: '' });
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const auth = useAppSelector((state) => state.auth);

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
        toast.error(error?.data?.message);
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
