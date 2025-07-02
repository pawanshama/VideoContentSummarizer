'use client'
import React, { useState } from 'react'
import { fetchPdf } from './extraFiles';
import { SideClickThreeButtonProps } from '@/services/types/Auth';
export default function SideClickThreeButton({ clicked }: SideClickThreeButtonProps) {
  const [clickedToShowPopUp, setClickedToShowPopUp] = useState<number>(0);
  const { isClicked, setIsClicked, id, setNumberToShow, sum } = clicked;
  // If summary is a separate prop, get it from props:
  // const { summary } = props;
  // Or, if summary should be inside clicked, update the type definition accordingly.
  // console.log(text);
  // const [ textShare , setTextShare ] = useState<String>(summary);
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
  
  const handleTextShare = async() => {
     try {
      if (navigator.share) {
        const shareData: ShareData = {
          title: "summary pdf", // Pass the actual summary title
          text: sum.summary_text,   // Pass the actual summary text content
          url: window.location.href, // The URL to the page
        };

        // --- Logic to include thumbnail ---
        if (sum.public_id) {
          const thumbnailUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/video/upload/so_1,w_400,h_300,c_fill/${sum.public_id}.jpg`;

          try {
            // 1. Fetch the image from Cloudinary
            const imageResponse = await fetch(thumbnailUrl);
            if (!imageResponse.ok) {
              console.warn(`Failed to fetch thumbnail from ${thumbnailUrl}. Sharing without image.`);
              // If fetching fails, we'll proceed without the image
            } else {
              // 2. Convert the response to a Blob
              const imageBlob = await imageResponse.blob();

              // 3. Create a File object from the Blob
              // Provide a suitable filename and MIME type
              const thumbnailFile = new File([imageBlob], 'summary_thumbnail.jpg', { type: 'image/jpeg' });

              // 4. Add the File object to the files array for sharing
              shareData.files = [thumbnailFile];
            }
          } catch (fetchError) {
            console.error('Error fetching or processing thumbnail for sharing:', fetchError);
            // Fallback: If there's an error in fetching/processing the image,
            // the share will proceed with just text/title/url.
          }
        }
        // --- End of thumbnail logic ---

        await navigator.share(shareData);
        console.log('Content (including potential thumbnail) shared successfully');

      } else {
        // Fallback for browsers that don't support the Web Share API at all
        alert('Sharing is not supported on this device/browser.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Catching specific errors from navigator.share
      if ((err as DOMException).name === 'AbortError') {
        console.log('Sharing cancelled by user.');
      } else {
        console.error('An unexpected error occurred during sharing:', err);
      }
    }
  }
  // try{
  //     if (navigator.share) {
  //       navigator.share({
  //         title: 'Share Summary',
  //         text: textShare.toString(),
  //         url: `http://localhost:3000/auth/summary/${id}`,
  //       })
  //       .then(() => console.log('Text shared successfully'))
  //       .catch((error) => console.error('Error sharing text:', error));
  //     }
  // }
  // catch(error){
  //   console.log("Error in sharing text", error);
  // }

  return (
    <div className=' w-1/10 h-1/7 absolute rounded-2xl top-0 right-3 cursor-pointer 
                ml-1 flex justify-end items-center gap-2'>
      { clickedToShowPopUp === 0 ?
       <div onClick={()=>{setClickedToShowPopUp(1);}} className='font-extrabold'>⋮</div> :
       <div className='flex flex-col absolute top-0 right-3 gap-2 bg-white 
       shadow-md rounded-2xl p-2 hover:shadow-lg transition'>
          <div className='flex tracking-tight text-red-300 
          cursor-pointer ml-1' onClick={()=>{handlePopUpFunction(-1)}}><span>🗑️</span> cancel </div>
          <div className='flex  tracking-tight text-gray-500 transition ml-1' onClick={()=>{fetchPdf(id)}}>
            <span>📩</span> export
          </div>
          <div className='flex  tracking-tight text-gray-500 transition ml-1' onClick={()=>{handleTextShare()}}>
            <span>🔗</span> share
          </div>
        </div>
      }
    </div>
  )
}