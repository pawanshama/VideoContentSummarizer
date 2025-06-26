// 'use client';
// import React, { useState } from 'react'
// import { FaFacebookMessenger } from "react-icons/fa";
// // import getInstance from '@/lib/utility/util';
// import { useRouter } from 'next/navigation';
// import { updateAuthByPayload } from '@/services/features/counter/auth.state'
// import { useUpdateUserLoginMutation } from '@/services/api';
// import { useAppDispatch,useAppSelector } from '@/lib/redux/hooks';
// import toast from 'react-hot-toast';


// export default function Login() {
//     const appName = "AI buddy"
//     const [formData,setFormData] = useState({name:"",email:"",password_hash:""});
//     const router = useRouter();
//     const [updatUser,{isSuccess,isLoading,isError}] = useUpdateUserLoginMutation();
//     const dispatch = useAppDispatch();
//     const auth = useAppSelector((state)=>state.auth.auth);

//     const handleUserInput = (event:React.ChangeEvent<HTMLInputElement>) => {
//         event.preventDefault();
//         const {name,value}= event.target
//         console.log(name,value);
//         setFormData(prev=>({...prev,[name]:value}));
//     }
//     const handleUserSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
//       e.preventDefault();
//         try{
//               console.log(formData);
//               const response = await updatUser(formData);
//               if(response.data){
//                     dispatch(updateAuthByPayload(response.data));
//                     toast("query passed");
//                     router.replace('dashboard');
//                 }
//                 else{
//                     toast("query failed");
//                 }
              
//         }
//         catch(error){
//               console.log("Error in login page.Handle it correctly",error)
//         }
//     }
//   return (
//     <div className='w-full box-border m-0 p-0'>
//       <main className=' flex flex-col lg:w-1/2 md:w-2/3 w-full lg:h-3/4 md:h-5/6 h-3/4 bg-sky-50 text-black rounded-2xl'>
//           <div className='flex flex-row mt-10 '>
//               <FaFacebookMessenger className='text-3xl mt-0.5'/>
//               <div className='text-3xl text-blue-900 '>{appName}</div>
//           </div>

//           <form className='flex flex-col w-1/3 sm:w-full h-200 bg-sky-50 text-black mt-12' onSubmit={handleUserSubmit}>
//             <div  className='flex m-8 font-medium justify-center'>
//               <input onChange={(e)=>handleUserInput(e)} placeholder='    email' type='email' name='email' className='w-100 h-10 border-1 rounded-xl'/>
//             </div>
//             <div className='flex m-8 font-medium justify-center'>
//              <input onChange={(e)=>handleUserInput(e)} placeholder='   fill password ' type='password' name='password_hash' className='w-100 h-10 border-1 rounded-xl '/>
//             </div>
//             <div className='flex m-8 justify-center'>
//                <button type='submit' className='text-2xl bg-green-400 w-1/3 h-10 rounded-3xl justify-center items-center'>Sign In</button>
//             </div>
//           </form>
//       </main>
//     </div>
//   )
// }


'use client';

import React, { useState } from 'react';
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
      console.log(response,'response response')
      if (response) {
        dispatch(updateAuthByPayload(response));
        //@ts-ignore
        
        toast.success('Login successful!');
        router.replace(`/auth/dashboard/${response?.newUser?.id}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error((error as any)?.data?.message || 'Login failed. Please try again.');
    }
  };

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
