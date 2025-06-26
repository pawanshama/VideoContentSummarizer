'use client';
import { store } from '@/services/store/store';
import React, { CSSProperties } from 'react'
import { Provider } from 'react-redux';
import { ClipLoader } from 'react-spinners';
const isLoading:any = true;
const page = () => {
  function MyComponent(isLoading:any ) {
      const override: CSSProperties = {
        display:"flex",
        // justifyContent:"center"
      };
          if (isLoading) {
            return (
              <div className='flex justify-center bg-gray-200 w-3/4 shadow-md rounded-2xl p-6 hover:shadow-lg transition'>
                 <ClipLoader
                    color={`#99a1af`}
                    loading={isLoading}
                    cssOverride={override}
                    size={70}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
              </div>
            );
          }
          return (
          <></>
          );
    }
    const name = "ungli movie"

  return (
    <>
    <Provider store={store}>
       <div className='w-1/8 absolute flex rounded-2xl p-4 shadow-md hover:shadow-lg transition bg-white bottom-3 right-6 z-10'>
          <div className="flex w-5 h-5 border-4 border-dotted border-gray-300 rounded-full " >
               <div className="w-3 h-3 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin " >
               </div>
          </div>
          <span className="text-sm text-gray-600 truncate max-w-[180px] ml-2">processing {name}</span>
        </div>
    </Provider>
    </>
  )
}

export default page
