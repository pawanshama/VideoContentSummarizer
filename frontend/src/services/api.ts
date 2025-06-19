// src/lib/redux/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {User }  from '@/services/types/User'
export const api = createApi({
  reducerPath: 'api', // optional but recommended
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8001/api/' }),
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => 'users',
    }),
    // Add more endpoints here
  }),
});

export const { useGetUserQuery } = api;