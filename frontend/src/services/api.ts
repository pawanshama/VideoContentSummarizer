// src/lib/redux/api.ts
import type { AuthState } from './types/Auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User }  from '@/services/types/User'
export const api = createApi({
  reducerPath: 'api', // optional but recommended
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8001/api/users/' }),
  endpoints: (builder) => ({
    getUser: builder.query< User,void>({
      query: () => 'users',
    }),
    // Add more endpoints here
    updateUser: builder.mutation<AuthState,User>({
      query: (patch) => ({
        url: `/signup`,
        // When performing a mutation, you typically use a method of
        // PATCH/PUT/POST/DELETE for REST endpoints
        method: 'POST',
        // fetchBaseQuery automatically adds `content-type: application/json` to
        // the Headers and calls `JSON.stringify(patch)`
        body: patch,
      }),
    }),
    }),
});

export const { useGetUserQuery,useUpdateUserMutation } = api;