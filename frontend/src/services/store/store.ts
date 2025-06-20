import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore } from "@reduxjs/toolkit";
import authReducer,{videoIdReducer,videoReducer} from '../features/counter/auth.state';
import { api } from '../api';

export const store = configureStore({
   reducer:{
         auth: authReducer,
         videoId:videoIdReducer,
         video:videoReducer,
        [api.reducerPath]: api.reducer,
   },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)