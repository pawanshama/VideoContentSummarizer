'use client'
import { useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/services/types/Auth";
import { CSSProperties, useCallback } from "react";
import { ClipLoader } from "react-spinners";

export const fetchPdf = async(numberToShow:number)=>{
    const userVideos:AuthState|any = useAppSelector(state=>state.auth.auth)
         try{
              const response = await fetch(`http://localhost:8001/api/summary/generate-pdf/${userVideos[numberToShow].id}`, {
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