import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'
import type { AuthState,AllInOneState,UploadState,videoState,BackedupState, summaryState, summarState } from '@/services/types/Auth'
import {createAuth,createVideo,createTranscript,createSummary} from '../../types/factories';

// Define the initial state using that type
const initialState: AllInOneState = {
  auth: createAuth(),
  status: { loading: false, failed: false, success: false },
  videoUpload: { video: createVideo() },
  video: {
    video: createVideo(),
    transcript: createTranscript(),
    summary: createSummary()
  },
  summar: [{
      created_at: '',
      id:'',
      model_used:'',
      summary_text:'',
      summary_type:'',
      tone_version:null,
      transcript_id:''
    }],
    token: { token: '' },
  
};

export const AuthSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateAuthByPayload: (state, action: PayloadAction<AuthState>) => {
      state.auth.name = action.payload.newUser.name,
      state.auth.id = action.payload.newUser.id,
      state.auth.email = action.payload.newUser.email,
      state.auth.password_hash = action.payload.newUser.password_hash,
      state.auth.status = action.payload.newUser.status,
      state.auth.subscription = action.payload.newUser.subscription,
      state.auth.created_at = action.payload.newUser.created_at,
      state.auth.updated_at = action.payload.newUser.updated_at
      console.log(action.payload);
    },
    clearAuth:(state)=>{
      state.auth = initialState.auth
    }
  },
})

export const VideoIdSlice = createSlice({
  name: 'videoId',
  // `createSlice` will infer the state type from the `initialState` argument
  // initialState,
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateVideoIdByPayload: (state, action: PayloadAction<UploadState>) => {
      state.videoUpload.video.id = action.payload.video.id,
      state.videoUpload.video.processing_status = action.payload.video.processing_status
      state.videoUpload.video.title = action.payload.video.title
      state.videoUpload.video.storage_url = action.payload.video.storage_url
    },
    clearVideoId:(state)=>{
      state.videoUpload = initialState.videoUpload
    }
  },
})

export const VideoSlice = createSlice({
  name: 'video',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateVideoByPayload: (state, action: PayloadAction<videoState>) => {
      state.video.video.id = action.payload.video.id,
      state.video.video.processing_status = action.payload.video.processing_status,
      state.video.video.storage_url = action.payload.video.storage_url,
      state.video.video.title = action.payload.video.title,
      state.video.transcript.id = action.payload.transcript.id,
      state.video.transcript.content = action.payload.transcript.content,
      state.video.transcript.model_used = action.payload.transcript.model_used,
      state.video.transcript.tone_version = action.payload.transcript.tone_version
      state.video.summary.id = action.payload.summary.id
      state.video.summary.model_used = action.payload.summary.model_used
      state.video.summary.type = action.payload.summary.type
      state.video.summary.text = action.payload.summary.text
    },
    clearVideo:(state)=>{
        state.video = initialState.video
    }
  },
})

export const BackedFilesSlice = createSlice({
  name:'sidebar',
  initialState,
  reducers:{
    getSidebar:(state,action:PayloadAction<summarState[]>) => {
        state.summar = action.payload
    },
    clearGetSidebar:(state)=>{
      state.summar = initialState.summar
    }
  }
})

export const { updateAuthByPayload,clearAuth } = AuthSlice.actions
export const {updateVideoIdByPayload,clearVideoId} = VideoIdSlice.actions
export const {updateVideoByPayload,clearVideo} = VideoSlice.actions
export const {getSidebar,clearGetSidebar} = BackedFilesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.auth

export default AuthSlice.reducer
export const backedFileReducer = BackedFilesSlice.reducer
export const videoIdReducer = VideoIdSlice.reducer
export const videoReducer = VideoSlice.reducer