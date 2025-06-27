'use client';
import { Provider } from 'react-redux';
import { store } from '@/services/store/store';
import Login from '@/components/login';
import ProtectedRoute from '@/components/protectedRoute';
export default function page() {
  return (
    <ProtectedRoute>
      <Provider store={store}>
          <Login/>
      </Provider>
    </ProtectedRoute>
  )
}
