'use client'
import React, { useState,useEffect} from 'react';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import { useGetUserQuery, useLazyGetUserQuery, useUploadUserVideoMutation } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateVideoByPayload, updateVideoIdByPayload } from '@/services/features/counter/auth.state';
import { useParams } from 'next/navigation';
import { summarState } from '@/services/types/Auth';

// { userVideos }: { userVideos: any[] }
export default function MainContainer() {
  const params = useParams();
  const userId:any = params.id;

  // const userId:any = useGetIdFromParams()
  // console.log(userId,'userId')
  const dispatch = useAppDispatch();
  const [fileData, setFileData] = useState<File | null>(null);
  const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();
  const [userVideos,setUserVideos] = useState<summarState[]>(useAppSelector(state=>state.backedFile.summar));
// const userVideos:any[] = [];
  const [userQuery,{isSuccess,isError}] = useLazyGetUserQuery();
  // handle file input here.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith('video/')) {
      setFileData(file);
      toast.success(`Selected: ${file.name}`);
    } else {
      toast.error('Please select a valid video file');
    }
    e.target.value = '';
  };
  
  //handle upload here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('videoFile', fileData);
    formData.append('user_id', userId);

    try {
      const res = await uploadUserVideo({ formData }).unwrap();
      dispatch(updateVideoIdByPayload(res));
      toast.success('Upload successful');
      setFileData(null);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };

  const getCallingFunction = async()=>{
    try{
        const response:summarState|any = await userQuery(userId);
        console.log(response.data.summary);
        if(response?.data){
          dispatch(updateVideoByPayload(response?.data?.summary))
          setUserVideos(response?.data?.summary);
        }
        else{

        }
    }
    catch(error){
      toast.error(`error in fetching`);
    }
  }
   useEffect(()=>{
        getCallingFunction();
   },[])

  const hasVideos = userVideos.length > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-100 relative px-6 py-10 mt-16">
      {/* Upload */}
      {hasVideos ? (
        <div className="absolute top-6 right-6 z-10">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md border border-gray-200"
          >
            <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
              <UploadCloud size={20} />
              <span>Upload</span>
              <input type="file" accept="video/*" onChange={handleInputChange} className="hidden" />
            </label>

            {fileData && (
              <>
                <span className="text-sm text-gray-600 truncate max-w-[180px]">{fileData.name}</span>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
                >
                  {isLoading ? 'Uploading...' : 'Submit'}
                </button>
              </>
            )}
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 bg-white p-10 rounded-2xl shadow-xl border border-gray-300"
          >
            <label className="cursor-pointer flex flex-col items-center gap-2 text-blue-600 hover:text-blue-800">
              <UploadCloud size={64} className="text-blue-500" />
              <span className="text-xl font-medium">Upload a Video</span>
              <input type="file" accept="video/*" onChange={handleInputChange} className="hidden" />
            </label>

            {fileData && (
              <div className="text-gray-600 text-sm truncate max-w-sm text-center">
                Selected: <strong>{fileData.name}</strong>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !fileData}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-green-300"
            >
              {isLoading ? 'Uploading...' : 'Upload & Evaluate'}
            </button>
          </form>
        </div>
      )}

      {/* Video Cards */}
      {hasVideos && (
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {((userVideos.length===1 && userVideos[-Symbol]?.id !=='') || (userVideos.length>2)) && userVideos.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => console.log('Clicked video:', item)}
            >
              <h3 className="text-md font-semibold text-gray-800 truncate">
                Video {index + 1}
              </h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {item.summary_text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  }
  
  
  
  
  //   <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-100 relative px-6 py-10 mt-16">
  //     <div className="absolute top-6 right-6 z-10">
  //       <form
  //         onSubmit={handleSubmit}
  //         className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md border border-gray-200"
  //       >
  //         <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
  //           <UploadCloud size={20} />
  //           <span>Upload</span>
  //           <input type="file" accept="video/*" onChange={handleInputChange} className="hidden" />
  //         </label>

  //         {fileData && (
  //           <>
  //             <span className="text-sm text-gray-600 truncate max-w-[180px]">{fileData.name}</span>
  //             <button
  //               type="submit"
  //               disabled={isLoading}
  //               className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
  //             >
  //               {isLoading ? 'Uploading...' : 'Submit'}
  //             </button>
  //           </>
  //         )}
  //       </form>
  //     </div>

  //     {/* Video Cards */}
  //     <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {userVideos.length > 0 ? (
  //         userVideos.map((item, index) => (
  //           <div
  //             key={index}
  //             className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
  //             onClick={() => console.log('Clicked video:', item)}
  //           >
  //             <h3 className="text-md font-semibold text-gray-800 truncate">
  //               Video {index + 1}
  //             </h3>
  //             <p className="text-sm text-gray-500 mt-2 line-clamp-3">
  //               {item.summary_text || 'No summary available'}
  //             </p>
  //           </div>
  //         ))
  //       ) : (
  //         <div className="col-span-full text-center text-gray-500 text-md mt-12">
  //           No videos uploaded yet.
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

// // 'use client';
// // import React, { useState } from 'react';
// // import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// // import { updateVideoIdByPayload } from '@/services/features/counter/auth.state';
// // import { useUploadUserVideoMutation } from '@/services/api';
// // import toast, { Toaster } from 'react-hot-toast';
// // import { UploadCloud } from 'lucide-react';

// // export default function FileUpload() {
// //   const userId:any = useAppSelector((state) => state.auth.auth.id);
// //   const dispatch = useAppDispatch();
// //   const [fileData, setFileData] = useState<File | null>(null);
// //   const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file: File | null = e.target.files?.[0] || null;

// //     if (file && file.type.startsWith('video/')) {
// //       setFileData(file);
// //       toast.success('Video selected: ' + file.name);
// //     } else {
// //       toast.error('Please select a valid video file');
// //     }

// //     e.target.value = ''; // allow same file selection again
// //   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();

// //     if (!fileData) {
// //       toast.error('Please upload a file before submitting');
// //       return;
// //     }

    
// //     try {
// //       const formData = new FormData();
// //       // console.log(fileData);
// //       formData.append('videoFile', fileData);
// //       formData.append("user_id",userId);
// //       const response = await uploadUserVideo({formData}).unwrap();

// //       if (response) {
// //         dispatch(updateVideoIdByPayload(response));
// //         toast.success('Upload successful!');
// //         setFileData(null);
// //       }
// //     } catch (error: any) {
// //       toast.error('Upload failed. Try again.');
// //       console.error('Upload error:', error);
// //     }
// //   };

// //   return (
// //     <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-sky-100 to-blue-200">
// //       <Toaster position="top-center" />

// //       <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
// //         <form onSubmit={handleSubmit} className="w-full space-y-6">
// //           <div className="flex flex-col items-center justify-center gap-2">
// //             <UploadCloud className="w-10 h-10 text-blue-500" />
// //             <h2 className="text-lg font-semibold text-gray-800">Upload a Video File</h2>
// //             <p className="text-sm text-gray-500">Only video formats are accepted (e.g., mp4, mov, webm)</p>
// //           </div>

// //           <input
// //             type="file"
// //             accept="video/*"
// //             onChange={handleInputChange}
// //             className="block w-full file:mr-4 file:py-2 file:px-4
// //               file:rounded-lg file:border-0
// //               file:text-sm file:font-semibold
// //               file:bg-blue-100 file:text-blue-700
// //               hover:file:bg-blue-200"
// //           />

// //           {fileData && (
// //             <div className="text-sm text-gray-600 truncate">
// //               Selected: <strong>{fileData.name}</strong>
// //             </div>
// //           )}

// //           <button
// //             type="submit"
// //             disabled={isLoading || !fileData}
// //             className="w-full bg-green-500 text-white py-3 cursor-pointer rounded-xl font-semibold text-lg transition-all hover:bg-green-600 disabled:bg-green-300"
// //           >
// //             {isLoading ? 'Uploading...' : 'Upload & Evaluate'}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }




// // // 'use client'
// // // import React,{useEffect, useState} from 'react'
// // // import { updateVideoByPayload, updateVideoIdByPayload, updateAuthByPayload } from '@/services/features/counter/auth.state'
// // // import { useAppSelector,useAppDispatch } from '@/lib/redux/hooks'
// // // import { useUploadUserVideoMutation } from '@/services/api'
// // // import toast from 'react-hot-toast'

// // // export default function FileUpload() {
// // //   const auth = useAppSelector((state)=>state.auth.auth.id);
// // //   // const user_id:any = useAppSelector((state: { auth: { auth: { id: any; }; }; })=>state.auth.auth.id);
// // //   const [fileData,setFileData] = useState<File|null>(null);
// // //   const dispatch = useAppDispatch();
// // //   const [uploadUserVideo,{data,isError,isLoading,isSuccess}] = useUploadUserVideoMutation();
// // //   const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
// // //       const file: File | null = e.target?.files?.[0] || null;
// // //       console.log(file);
// // //       if (file && file.type.startsWith("video/")) {
// // //           setFileData(file);
// // //       }
// // //   }

// // //    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
// // //     e.preventDefault();
// // //       try{
// // //           if(fileData){
// // //             const formData = new FormData();
// // //               formData.append("video",fileData);
// // //               // formData.append("user_id",user_id);
// // //              const response = await uploadUserVideo({formData,user_id:auth}).unwrap();
// // //              if(response){
// // //                dispatch(updateVideoIdByPayload(response));
// // //              }
// // //              else{
// // //                console.log("Error at obtaining response from backend as response Data");
// // //              }
// // //           }
// // //           else{
// // //             toast.error("upload file correctly");
// // //           }
// // //       }
// // //       catch(error){
// // //           console.log("Error in fileUpload",error);
// // //       }
// // //    }
// // //   return (
// // //     <div className={`flex justify-center items-center h-screen w-full`}>
// // //         <div className={`flex relative w-3/4 h-1/2 bg-gray-200 justify-center items-center rounded-2xl`}>
// // //         <form className='' onSubmit={(e)=>handleSubmit(e)}>
// // //            <input accept='video/*' className={`text-black bg-white p-2 absolute rounded-2xl`}  type='file' name='file' onChange={(e)=>{handleInputChange(e);e.target.value = "";}}/>
// // //           <button className='absolute mt-10' type='submit'> Evaluate </button>
// // //         </form>
// // //         </div>
// // //     </div>
// // //   )
// // // }



// 'use client';
// import React, { useState } from 'react';
// import { UploadCloud } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';
// import { useUploadUserVideoMutation } from '@/services/api';
// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { updateVideoIdByPayload } from '@/services/features/counter/auth.state';

// interface FileUploadProps {
//   userVideos: any[]; // pass uploaded video list to control layout
// }
// // { userVideos }: FileUploadProps
// export default function FileUpload() {
//   const userId:any = useAppSelector((state) => state.auth.auth.id);
//   const dispatch = useAppDispatch();
//   const userVideos = useAppSelector(state=>state.video.video.summary);
//   console.log(userVideos)
//   const [fileData, setFileData] = useState<File | null>(null);
//   const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;

//     if (file && file.type.startsWith('video/')) {
//       setFileData(file);
//       toast.success(`Selected: ${file.name}`);
//     } else {
//       toast.error('Please select a valid video file');
//     }

//     // e.target.value = ''; // reset to allow re-select
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!fileData) return toast.error('Please select a file');

//     const formData = new FormData();
//     formData.append('videoFile', fileData);
//     formData.append('user_id', userId);

//     try {
//       const res = await uploadUserVideo({ formData }).unwrap();
//       dispatch(updateVideoIdByPayload(res));
//       toast.success('Upload successful');
//       setFileData(null);
//     } catch (err) {
//       console.error(err);
//       toast.error('Upload failed. Try again.');
//     }
//   };

//   const isCenter = userVideos?.length === 0;

//   return (
//     <div
//       className={`${
//         isCenter ? 'flex justify-center items-center h-full' : 'absolute top-4 right-6'
//       } z-10`}
//     >
//       <Toaster position="top-center" />
//       <form
//         onSubmit={handleSubmit}
//         className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-md border border-gray-200"
//       >
//         <label className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
//           <UploadCloud size={20} />
//           <span>Upload</span>
//           <input
//             type="file"
//             accept="video/*"
//             onChange={handleInputChange}
//             className="hidden"
//           />
//         </label>

//         {fileData && (
//           <>
//             <span className="text-sm text-gray-600 truncate max-w-[180px]">
//               {fileData.name}
//             </span>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition disabled:bg-green-300"
//             >
//               {isLoading ? 'Uploading...' : 'Submit'}
//             </button>
//           </>
//         )}
//       </form>
//     </div>
//   );
// }

