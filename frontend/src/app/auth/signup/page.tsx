"use client"
import React , { useState } from 'react'
import { FaFacebookMessenger } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import { updateVideoByPayload, updateVideoIdByPayload, updateAuthByPayload } from '@/services/features/counter/auth.state'
import { useUpdateUserMutation } from '@/services/api';
import Signup from '@/components/signup';
import { Toaster } from 'react-hot-toast';

export default function page() {
  return (
    <Provider store={store}>
      <Signup/>
      <Toaster/>
    </Provider>
  )
}
