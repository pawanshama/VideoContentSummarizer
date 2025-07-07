'use client'
import React, { useState,useEffect} from 'react';
import toast from 'react-hot-toast';
import { Copy, StopCircle, UploadCloud, Volume2 } from 'lucide-react';
import {  useLazyGetUserQuery, useUploadUserVideoMutation } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSidebar, updateVideoIdByPayload } from '@/services/features/counter/auth.state';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MyComponent } from './extraFiles';
import { summarState } from '@/services/types/Auth';
import SideClickThreeButton from './sideClickThreeButton'
import { speakText,stopSpeaking,copyToClipboard } from './extraFiles';
export default function MainContainer() {

  const params = useParams();
  const userId:any = params.id;
  const dispatch = useAppDispatch();
  const [fileData, setFileData] = useState<File | null>(null);
  const [uploadUserVideo, { isLoading }] = useUploadUserVideoMutation();
  const [userVideos,setUserVideos] = useState<summarState[]>(useAppSelector(state=>state.backedFile.summar));
  const videoData = useAppSelector(state=>state.videoId.videoUpload.video); 
  const [userQuery] = useLazyGetUserQuery();
  const [isClicked,setIsClicked] = useState<boolean>(false);
  const [numberToShow,setNumberToShow] = useState<number>(-1)
  const [isCopyToClipboardClicked,setIsCopyToClipboardClicked] = useState<boolean>(false);
  const [isTextToSpeechClicked,setIsTextToSpeechClicked] = useState<boolean>(false);
  // Initialize speech synthesis
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
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
  //fetching the previous videos of the user
  const getCallingFunction = async()=>{
    try{
      const response:summarState[]|any = await userQuery(userId);
      dispatch(getSidebar(response?.data?.summary));
      if(JSON.stringify(response?.data?.summary) !== JSON.stringify(userVideos)){
        setUserVideos(response?.data?.summary);
      }
    }
    catch(error){
      toast.error(`Error in fetching previous videos.`);
    }
  }
  //function to handle the click on the video card
  const handlePopUpFunction = (index: number)=>{
    // console.log("button clicked");
    setIsCopyToClipboardClicked(false);
    if(isClicked==false){
      setNumberToShow(index);
      setIsClicked(true);
    }
    else{
      setNumberToShow(-1);
      setIsClicked(false);
    }
  }
  useEffect(()=>{
    getCallingFunction();
  },[videoData])
  
    const hasVideos = userVideos.length > 0 && userVideos[0].id.trim() !='';

      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-blue-100 relative px-4 py-10">
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
                <span className="text-sm text-gray-600 truncate max-w-[180px]">{fileData.name} </span>
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
        <div className={` pt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}>
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
            className={`flex w-full bg-white shadow-md ${index===0 ? `border-4 border-solid border-red-300` : ``} rounded-2xl p-4 hover:shadow-lg transition cursor-pointer`}
            onClick={() => {handlePopUpFunction(index)}}
            >
              <div className='w-1/4 flex mr-3'>
                <Image src={!item.public_id? "/Gemini_Generated_Image.jpg"  :`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/video/upload/so_1,w_400,h_300,c_fill/${item.public_id}.jpg`} alt='video-image' className ='rounded-2xl items-center' width={400} height={300}/>
              </div>
              <div className='w-3/4 '> 
                <h3 className="text-md font-semibold text-gray-800 truncate">
                  Video {index + 1}
                </h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {item.summary_text}
                </p>
              </div>
            </div>
           ))}
        </div>
      )}
      {
        isLoading && fileData &&
        <div className='w-1/8 max-sm:w-3/8 absolute flex rounded-2xl p-4 shadow-md hover:shadow-lg transition bg-gray-400 top-30 right-6 z-10'>
            <div className="flex w-5 h-5 border-4 border-dotted border-gray-300 rounded-full " >
              <div className="w-3 h-3 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin " >
              </div>
            </div>
            <span className="text-sm text-gray-600 truncate max-w-[180px] ml-2">processing {fileData.name}</span>
        </div>
      }
      {
        isClicked &&
            <div
            key={numberToShow}
            className="flex flex-col w-4/5 justify-center max-sm:h-96 sm:h-96 md:h-1/3 h-1/4 absolute z-10 top-17 bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition cursor-pointer"
            > 
              <div className={`w-full h-full relative bg-white mb-3`} >
                  {
                      <SideClickThreeButton  clicked={{isClicked, setIsClicked,sum:userVideos[numberToShow] , id: userVideos[numberToShow].id, setNumberToShow}}/>
                  }
              </div>
              <div className='flex h-full w-full bg-white max-lg:flex-col'>
                <div className='w-1/4 max-lg:h-1/2 max-lg:w-full flex mr-3 '>
                  <Image src={!userVideos[numberToShow].public_id? "/Gemini_Generated_Image.jpg"  :`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/video/upload/so_1,w_400,h_300,c_fill/${userVideos[numberToShow].public_id}.jpg`} alt='video-image' className='w-full rounded-2xl items-center' width={400} height={300}/>  
                </div>
              <div className='flex flex-col items-start w-3/4 max-lg:w-full overflow-y-scroll'>
                <p className="text-sm text-gray-500 mt-4">
                  {userVideos[numberToShow].summary_text} 
                </p>  
                <div className='flex bg-white w-1/3 h-1/9 mt-3 mb-4 gap-3'>
                  <Copy className="w-4 h-4 text-gray-400 cursor-pointer mt-1" fill={isCopyToClipboardClicked ? `rgb(128, 128, 128)`:`white`} onClick={()=>{copyToClipboard(userVideos[numberToShow].summary_text,setIsCopyToClipboardClicked);}}/>
                  <Volume2 className="w-4 h-4 text-gray-400 cursor-pointer mt-1" fill={isTextToSpeechClicked? `rbg(128,128,128)`:`white`} onClick={()=>{speakText(userVideos[numberToShow].summary_text,synth,setIsTextToSpeechClicked)}}/>
                  <StopCircle className="w-4 h-4 text-gray-400 cursor-pointer mt-1" onClick={()=>{stopSpeaking(synth,setIsTextToSpeechClicked)}}/>
                </div>
              </div>
            </div> 
          </div>
       }
    </div>
  );
}