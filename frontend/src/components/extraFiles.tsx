'use client'
import { useRouter } from "next/router";
import { CSSProperties} from "react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearAuth, clearGetSidebar, clearVideo, clearVideoId } from '@/services/features/counter/auth.state';
export const fetchPdf = async(id:string)=>{
         try{
              const response = await fetch(`http://localhost:8001/api/summary/generate-pdf/${id}`, {
                      method: 'Get',
                      credentials:'include'
                    });
                    if (!response.ok) {
                      throw new Error('Failed to fetch PDF');
                    }

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'summary.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
         }
         catch(error){
           console.log(error);
         }
}

export function MyComponent(isLoading:any ) {
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
export const speakText = (summary_text: string, synth: SpeechSynthesis | null,setIsTextToSpeechClicked:React.Dispatch<React.SetStateAction<boolean>>) => {
    if(!synth) return;
    const utterance = new SpeechSynthesisUtterance(summary_text); 
    utterance.voice = synth.getVoices().find(voice => voice.name === 'Google Uk') || synth.getVoices()[0]; 
    utterance.rate = 1; // Set the speech rate (1 is normal speed)
    synth.cancel(); // Cancel any ongoing speech
    synth.speak(utterance);
    setIsTextToSpeechClicked(true);
};
export  const stopSpeaking = (synth:SpeechSynthesis | null,setIsTextToSpeechClicked:React.Dispatch<React.SetStateAction<boolean>>) => {
    if(synth) synth.cancel();
    setIsTextToSpeechClicked(false);
};
export const copyToClipboard = (text: string, setIsCopyToClipboardClicked:React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopyToClipboardClicked(true);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
};
