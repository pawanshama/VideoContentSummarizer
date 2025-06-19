import React from 'react'
import { store } from '@/services/store/store'
import { Provider } from 'react-redux'

export default function fileUpload() {
  return (
    <Provider store={store}>
        <div>
           
        </div>
    </Provider>
  )
}
