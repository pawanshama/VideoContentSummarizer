"use client"
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import Signup from '@/components/signup';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/components/protectedRoute';

export default function page() {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <Signup/>
        <Toaster/>
      </Provider>
    </ProtectedRoute>
  )
}
