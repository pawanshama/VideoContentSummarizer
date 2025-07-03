'use client'
import React, { useState } from 'react'
import { fetchPdf } from './extraFiles';
import { SideClickThreeButtonProps } from '@/services/types/Auth';
import { Metadata } from 'next';
// import Link from 'next/link'; // Import Link for navigation to individual summary pages

// Import react-share components
import {
  WhatsappShareButton, WhatsappIcon,
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, XIcon,
  LinkedinShareButton, LinkedinIcon,
  EmailShareButton, EmailIcon,
} from 'react-share';

export default function SideClickThreeButton({ clicked }: SideClickThreeButtonProps) {
  const [clickedToShowPopUp, setClickedToShowPopUp] = useState<number>(0);
  const [isShareClicked, setIsShareClicked] = useState<boolean>(false);
  const { isClicked, setIsClicked, id, setNumberToShow, sum } = clicked;
  const summaryShareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/summary/${id}`;
  const summaryImageUrl = sum.public_id 
              ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/video/upload/so_1,w_400,h_225,c_fill/${sum.public_id}.jpg`
              : `/Gemini_Generated_Image.jpg`;
  const handlePopUpFunction = (index: number) => {
    if (isClicked == false) {
      setNumberToShow(index);
      setIsClicked(true);
    }
    else {
      setNumberToShow(-1);
      setIsClicked(false);
      setClickedToShowPopUp(0);
    }
  }

  return (
    <div className=' w-1/10 h-1/7 absolute rounded-2xl top-0 right-3 cursor-pointer 
                ml-1 flex justify-end items-center gap-2'>
      { clickedToShowPopUp === 0 ?
       <div onClick={()=> setClickedToShowPopUp(1)} className='font-extrabold'>⋮</div> :
       <div className='flex flex-col absolute top-0 right-3 gap-2 bg-white 
       shadow-md rounded-2xl p-2 hover:shadow-lg transition'>
          <div className='flex  tracking-tight text-gray-500 transition ml-1' onClick={()=>{fetchPdf(id)}}>
            <span>📩</span> export
          </div>
          <div>
            {
            isShareClicked ? <div className='flex gap-2 bg-white rounded-2xl p-2 hover:shadow-sm transition bg-[rgba(0,0,0, 0.4)]'>
            <WhatsappShareButton url={summaryShareUrl} title={`Check out this summary: ${id}`} >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            <FacebookShareButton url={summaryShareUrl} hashtag="#SummaryApp" title={`Read this amazing summary: ${sum.summary_text}`}>
              <FacebookIcon size={30} round />
            </FacebookShareButton>
                </div>
                  :
           <div className='flex  tracking-tight text-gray-500 transition ml-1' onClick={()=>setIsShareClicked(true)}>
             <span>🔗</span> share
           </div>
  }
          </div>
          <hr className='text-gray-300'/>
          <div className='flex tracking-tight text-red-300 
          cursor-pointer ml-1' onClick={()=>{handlePopUpFunction(-1)}}><span>🗑️</span> cancel </div>
        </div>
      }
    </div>
  )
}