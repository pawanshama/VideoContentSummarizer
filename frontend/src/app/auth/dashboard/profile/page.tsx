'use client';
import React from 'react'
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import Profile from '@/components/profile';
import ProtectedRoute from '@/components/protectedRoute';

export default function page() {     
  return (
    <ProtectedRoute>
      <Provider store={store}>
          <Profile/>
      </Provider>
    </ProtectedRoute>
  )
}
