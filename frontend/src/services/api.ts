// src/lib/redux/api.ts
import type { AuthState, BackedupState, UploadState } from './types/Auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User }  from '@/services/types/User'


export const api = createApi({
  reducerPath: 'api', // optional but recommended
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8001/api/' }),
  endpoints: (builder) => ({
    getUser: builder.query< BackedupState[],String>({
      //fetching uploaded videos of a user
      query: (id) => `videos/backup/${id}`,
    }),
    // Add more endpoints here
    updateUser: builder.mutation<AuthState,User>({
      query: (patch) => ({
        url: `users/signup`,
        // When performing a mutation, you typically use a method of
        // PATCH/PUT/POST/DELETE for REST endpoints
        method: 'POST',
        // fetchBaseQuery automatically adds `content-type: application/json` to
        // the Headers and calls `JSON.stringify(patch)`
        body: patch,
      }),
    }),
    updateUserLogin: builder.mutation<AuthState,User>({
      //login request to backend
      query: (patch) => ({
        url: `users/login`,
        // When performing a mutation, you typically use a method of
        // PATCH/PUT/POST/DELETE for REST endpoints
        method: 'POST',
        // fetchBaseQuery automatically adds `content-type: application/json` to
        // the Headers and calls `JSON.stringify(patch)`
        body: patch,
      }),
    }),
    uploadUserVideo:builder.mutation<UploadState,{formData: FormData,user_id:any}>({
       query:(patch)=>{
        return {
          url:`videos/upload`,
          method:'POST',
          body:patch
        }
       }
    }),
    
    }),
});

export const { useGetUserQuery,useLazyGetUserQuery,useUpdateUserMutation,useUpdateUserLoginMutation,useUploadUserVideoMutation } = api;