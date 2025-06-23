'use client';
import { store } from '@/services/store/store';
import React from 'react'
import { Provider } from 'react-redux';

const page = () => {
  return (
    <>
    <Provider store={store}>
      <h1>jdksdkjkj</h1>
    </Provider>
    </>
  )
}

export default page
