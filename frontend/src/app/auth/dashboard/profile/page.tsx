'use client';
import React from 'react'
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import Profile from '@/components/profile';

export default function page() {
       
  return (
    <Provider store={store}>
        <Profile/>
    </Provider>
  )
}
