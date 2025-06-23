// 'use client'
// import React,{useEffect, useState} from 'react'
// import { updateVideoByPayload, updateVideoIdByPayload, updateAuthByPayload } from '@/services/features/counter/auth.state'
// import { useAppSelector,useAppDispatch } from '@/lib/redux/hooks'
// import { useUploadUserVideoMutation } from '@/services/api'
// import toast from 'react-hot-toast'

// export default function FileUpload() {
//   const auth = useAppSelector((state)=>state.auth.auth.id);
//   // const user_id:any = useAppSelector((state: { auth: { auth: { id: any; }; }; })=>state.auth.auth.id);
//   const [fileData,setFileData] = useState<File|null>(null);
//   const dispatch = useAppDispatch();
//   const [uploadUserVideo,{data,isError,isLoading,isSuccess}] = useUploadUserVideoMutation();
//   const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
//       const file: File | null = e.target?.files?.[0] || null;
//       console.log(file);
//       if (file && file.type.startsWith("video/")) {
//           setFileData(file);
//       }
//   }

//    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
//     e.preventDefault();
//       try{
//           if(fileData){
//             const formData = new FormData();
//               formData.append("video",fileData);
//               // formData.append("user_id",user_id);
//              const response = await uploadUserVideo({formData,user_id:auth}).unwrap();
//              if(response){
//                dispatch(updateVideoIdByPayload(response));
//              }
//              else{
//                console.log("Error at obtaining response from backend as response Data");
//              }
//           }
//           else{
//             toast.error("upload file correctly");
//           }
//       }
//       catch(error){
//           console.log("Error in fileUpload",error);
//       }
//    }
//   return (
//     <div className={`flex justify-center items-center h-screen w-full`}>
//         <div className={`flex relative w-3/4 h-1/2 bg-gray-200 justify-center items-center rounded-2xl`}>
//         <form className='' onSubmit={(e)=>handleSubmit(e)}>
//            <input accept='video/*' className={`text-black bg-white p-2 absolute rounded-2xl`}  type='file' name='file' onChange={(e)=>{handleInputChange(e);e.target.value = "";}}/>
//           <button className='absolute mt-10' type='submit'> Evaluate </button>
//         </form>
//         </div>
//     </div>
//   )
// }


'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateVideoIdByPayload } from '@/services/features/counter/auth.state';
import { useUploadUserVideoMutation } from '@/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';

export default function FileUpload() {
  const userId = useAppSelector((state) => state.auth.auth.id);
  const dispatch = useAppDispatch();
  const [fileData, setFileData] = useState<File | null>(null);
  const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;

    if (file && file.type.startsWith('video/')) {
      setFileData(file);
      toast.success('Video selected: ' + file.name);
    } else {
      toast.error('Please select a valid video file');
    }

    e.target.value = ''; // allow same file selection again
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileData) {
      toast.error('Please upload a file before submitting');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('video', fileData);

      const response = await uploadUserVideo({ formData, user_id: userId }).unwrap();

      if (response) {
        dispatch(updateVideoIdByPayload(response));
        toast.success('Upload successful!');
        setFileData(null);
      }
    } catch (error: any) {
      toast.error('Upload failed. Try again.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-sky-100 to-blue-200">
      <Toaster position="top-center" />

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <UploadCloud className="w-10 h-10 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Upload a Video File</h2>
            <p className="text-sm text-gray-500">Only video formats are accepted (e.g., mp4, mov, webm)</p>
          </div>

          <input
            type="file"
            accept="video/*"
            onChange={handleInputChange}
            className="block w-full file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
          />

          {fileData && (
            <div className="text-sm text-gray-600 truncate">
              Selected: <strong>{fileData.name}</strong>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !fileData}
            className="w-full bg-green-500 text-white py-3 cursor-pointer rounded-xl font-semibold text-lg transition-all hover:bg-green-600 disabled:bg-green-300"
          >
            {isLoading ? 'Uploading...' : 'Upload & Evaluate'}
          </button>
        </form>
      </div>
    </div>
  );
}
