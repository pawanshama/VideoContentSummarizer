// 'use client'
// import getInstance from '@/lib/utility/util'
// import { BackedupState } from '@/services/types/Auth';
// import React,{useEffect, useState} from 'react'
// import toast from 'react-hot-toast'
// import { useAppDispatch,useAppSelector } from '@/lib/redux/hooks';
// import { getSidebar } from '@/services/features/counter/auth.state';
// import { useLazyGetUserQuery } from '@/services/api';

// export default function Sidebar({stringfromparent}:{stringfromparent:string}) {
//     // const {stringfromparent} = props;
//     const [userList,setUserList] = useState<BackedupState[]>();
//     const dispatch = useAppDispatch();
//     const id = useAppSelector((state)=>state.auth.auth.id);
//     console.log(id);
//     const [getUser,{data,error,isSuccess,isFetching,isLoading,isError}] = useLazyGetUserQuery();
//     const file = useAppSelector((state)=>state.backedFile.backedFile)
//     // console.log(file);
//     const handleBackendRequest = async()=>{
//       try{
//         const response = await getUser(id);
//           setUserList(response?.data?.data);
//         // console.log(response.data.data);
//         dispatch(getSidebar(response?.data?.data));
//         if(isError){
//           console.log("error occured while fetching");
//         } 
//         else if(isSuccess){
//           console.log("data fetched from backend");
//         }
//       }
//       catch(error){
//          console.log("Error at Sidebar",error);
//          toast("error occured");
//       }
//     }
    
//     useEffect(()=>{
//         handleBackendRequest();
//     },[])
   
//   return (

//     <div className={` h-screen p-6 rounded-r-xl bg-gray-200 font-medium ${stringfromparent}`}>
//        <div className='flex flex-col mt-3 bg-white rounded-2xl'>
//             {userList ? userList?.map((item,index)=>{
//                 return <div className='flex h-12 items-center mb-3 bg-gray-200 rounded-xl' key={index}>{item.title}</div>
//             })
//             :
//             <div>upload video</div>
//         }
//        </div> 
//     </div>
//   )
// }


'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getSidebar } from '@/services/features/counter/auth.state';
import { useLazyGetUserQuery } from '@/services/api';
import { BackedupState } from '@/services/types/Auth';
import { VideoIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ stringfromparent }: { stringfromparent: string }) {
  const [userList, setUserList] = useState<BackedupState[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.auth.auth.id);
  const [getUser, { isFetching }] = useLazyGetUserQuery();

  const fetchUserData = async () => {
    try {
      const response = await getUser(id).unwrap();
      if (response?.data) {
        setUserList(response.data);
        dispatch(getSidebar(response.data));
      }
    } catch (error) {
      toast.error('Failed to fetch sidebar data.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <aside
      className={` mt-17
        h-screen bg-white border-r border-gray-200 shadow-sm 
        transition-all duration-300 ease-in-out 
        ${collapsed ? 'w-[70px]' : 'w-[280px]'} 
        ${stringfromparent}
      `}
    >
      {/* Toggle Collapse Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-blue-500 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Sidebar Header */}
      {!collapsed && (
        <div className="px-4 mb-4">
          <h2 className="text-md font-semibold text-gray-800">Uploaded Videos</h2>
          <p className="text-sm text-gray-500">Your recent uploads</p>
        </div>
      )}

      {/* List */}
      <div className="px-2 space-y-2 overflow-y-auto h-[85%] scrollbar-thin">
        {isFetching && (
          <div className="text-center text-sm text-gray-500 animate-pulse">Loading...</div>
        )}

        {!isFetching && userList.length > 0 ? (
          userList.map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 p-2 rounded-md bg-gray-100 hover:bg-blue-100
                cursor-pointer transition-all group
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <VideoIcon className="w-5 h-5 text-blue-600" />
              {!collapsed && (
                <span className="text-sm text-gray-800 truncate">{item.title}</span>
              )}
            </div>
          ))
        ) : (
          !isFetching && (
            <div className="text-sm text-gray-400 text-center mt-12">
              No videos found.
            </div>
          )
        )}
      </div>
    </aside>
  );
}
