import getInstance from '@/lib/utility/util'
import React from 'react'
import { store } from '@/services/store/store'
import { Provider } from 'react-redux'
export default async function Sidebar() {
    
   

  return (
    <Provider store={store}>
     <div className='w-full h-ful m-0 p-0 '>
         <div className='w-full h-full bg-gray-400 '>
            <div>
                
            </div>
         </div>
     </div>
    </Provider>
  )
}
