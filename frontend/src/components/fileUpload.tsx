'use client'
import React, { useState,useEffect, CSSProperties} from 'react';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';
import {  useLazyGetUserQuery, useUploadUserVideoMutation } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSidebar, updateVideoIdByPayload } from '@/services/features/counter/auth.state';
import { useParams } from 'next/navigation';
import { summarState } from '@/services/types/Auth';
// import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ClipLoader } from 'react-spinners';

export default function MainContainer() {
  const params = useParams();
  const userId:any = params.id;
  const dispatch = useAppDispatch();
  const [fileData, setFileData] = useState<File | null>(null);
  const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();
  const [userVideos,setUserVideos] = useState<summarState[]>(useAppSelector(state=>state.backedFile.summar));
  const videoData = useAppSelector(state=>state.videoId.videoUpload.video); 
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
      toast.error('Upload failed');
    }
  };
  
  const getCallingFunction = async()=>{
    try{
      const response:summarState[]|any = await userQuery(userId);
      dispatch(getSidebar(response?.data?.summary))
      setUserVideos(response?.data?.summary);
    }
    catch(error){
      toast.error(`Error in fetching previous videos.`);
    }
  }

function MyComponent(isLoading:any ) {
        const override: CSSProperties = {
           display:"flex",
           justifyContent:"center"
        };
            if (isLoading) {
              return (
                <div className='flex justify-center bg-gray-200 w-3/4 shadow-md rounded-2xl p-6 hover:shadow-lg transition'>
                   <ClipLoader color={`#99a1af`} loading={isLoading} cssOverride={override}
                      size={70} aria-label="Loading Spinner" data-testid="loader"/>
                </div>
              );
            }
            return (
            <></>
            );
  }
      useEffect(()=>{
        getCallingFunction();
      },[userVideos,videoData])
      
      const handlePopUpFunction = (index: number)=>{
        toast(`${userVideos[index].summary_text}`)
      }
      
      const hasVideos = userVideos.length > 0 && userVideos[0].id !='';
      
      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-100 relative px-4 py-10">
      {/* Upload */}
      {hasVideos ? (
        <div className="absolute top-18 right-6 z-10">
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
                   Submit
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
              Upload & Evaluate
            </button>
          </form>
        </div>
      )}

      {/* Video Cards */}
      {hasVideos && (
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          { isLoading ?
          <div className='flex justify-center'>
           { MyComponent(isLoading)}
          </div>
          :
          <></>
          }
          {((userVideos.length===1 && userVideos[0]?.id !=='') || (userVideos.length>=2)) && userVideos.map((item, index) => (
            <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => {handlePopUpFunction(index)}}
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
      {
        isLoading && fileData &&
        <div className='w-1/8 absolute flex rounded-2xl p-4 shadow-md hover:shadow-lg transition bg-white bottom-3 right-6 z-10'>
            <div className="flex w-5 h-5 border-4 border-dotted border-gray-300 rounded-full " >
              <div className="w-3 h-3 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin " >
              </div>
            </div>
            <span className="text-sm text-gray-600 truncate max-w-[180px] ml-2">processing {fileData.name}</span>
        </div>
      }
    </div>
  );
}