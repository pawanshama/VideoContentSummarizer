'use client'
// This page will display a single summary when shared or linked directly.
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MetaHead from './metahead';

// Import react-share components for this individual summary page as well,
// so users can share it directly from its own page.
import {
  WhatsappShareButton, WhatsappIcon,
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, XIcon,
  LinkedinShareButton, LinkedinIcon,
  EmailShareButton, EmailIcon,
} from 'react-share';

interface Summary {
  id: string;
  title: string;
  text: string;
  thumbnail: string; // Assuming this is the Cloudinary public ID
  createdAt: string;
}

export default function SummaryDisplayPage() {
  // const { id } = await params;
  const params = useParams();
  const id  = params.id; 
  const [summar,setSummar] = useState<Summary | any>(null);
  // let summary: Summary | any ;
  const callFetchSummary = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${id}`, {
          cache: 'no-store', // Or whatever cache strategy makes sense for summary content
        });
        if (!res.ok) {
          // If summary not found, trigger Next.js 404 page
          notFound();
        }
        const response = await res.json();
        setSummar(response);
        if (!summar) {
          notFound();
        }
      } catch (error) {
        console.error(`Error fetching summary ${id} for display:`, error);
        // If there's an error, you might show an error message or redirect to a general error page
        notFound(); // Default to 404 if fetch fails
      }
    }
    // Double-check if summary is null (though notFound() should handle this)
    useEffect(() => {
      callFetchSummary();
    },[])
    console.log(summar,'summary in summary display page');
    const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/summary/${id}`; // The URL for this specific summary
    
    return (
      <> 
        {summar && <MetaHead
          title={summar.title}
          description={summar.summary_text}
          imageUrl={summar.thumbnail ? summar.thumbnail : `/Gemini_Generated_Image.jpg`}
          url={shareUrl}
        />}
      {
        summar ?
        <main className="flex flex-col max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-17">
        
        <div className='flex flex-col items-center mb-8'>
      {summar.thumbnail && (
        <div className="relative w-40 h-30 mb-8 rounded-lg overflow-hidden">
          <Image
            src={summar.thumbnail ? summar.thumbnail : `/Gemini_Generated_Image.jpg`}
            alt={summar.title}
            fill // Use fill to make the image cover the div
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
            className="object-cover"
            priority // Load primary image faster
            />
        </div>
      )}
      <h1 className="text-xl font-medium text-gray-500 mb-4">{summar.summary_text}</h1>
      </div>

      <div className="mt-2 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xl font-semibold text-gray-700">Share This Summary:</span>
        <div className="flex gap-3">
        </div>
      </div>
      <div className='flex gap-2 mt-4'>
        <WhatsappShareButton url={shareUrl} title={`Check out this summary: ${id}`} >
                       <WhatsappIcon size={32} round />
                   </WhatsappShareButton>
                   <FacebookShareButton url={shareUrl} hashtag="#SummaryApp" title={`Read this amazing summary: ${summar.summary_text}`}>
                      <FacebookIcon size={30} round />
        </FacebookShareButton>
      </div>
    </main>
     :<>
     {!summar && (
       <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center mb-8 rounded-lg">
         <span className="text-gray-500 text-xl">Summary not available</span>
       </div>
     )}
     </>
    }
      </>
  );
}
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: summary.title,
//       description: summary.text.slice(0, 1) + '...',
//       images: [
//         summary.thumbnail
//           ? summary.thumbnail
//           : `/Gemini_Generated_Image.jpg`,
//       ],
//     },
//   };
// }

// --- Component to display a single summary ---

          // <FacebookShareButton url={shareUrl} hashtag="#SummaryApp">
          //   <FacebookIcon size={40} round />
          // </FacebookShareButton>

          // <TwitterShareButton url={shareUrl} title={`Read this amazing summary: ${summary.title}`} hashtags={['AIsummaries', 'SummaryApp']}>
          //   <XIcon size={40} round />
          // </TwitterShareButton>

          // <LinkedinShareButton url={shareUrl} title={summary.title} summary={summary.text.slice(0, 150) + '...'} source={process.env.NEXT_PUBLIC_FRONTEND_URL}>
          //   <LinkedinIcon size={40} round />
          // </LinkedinShareButton>

          // <EmailShareButton url={shareUrl} subject={`Summary: ${summary.title}`} body={`I found this interesting summary:\n\n${summary.text.slice(0, 200)}...\n\nRead more here: ${shareUrl}`}>
          //   <EmailIcon size={40} round />
          // </EmailShareButton>