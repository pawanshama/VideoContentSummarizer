
// Define a type for the slice state
export interface AuthState {
   name: String,
   email:String,
   password_hash:String,
   subscription: null,
   status: null,
   id:String,
   created_at:String,
   updated_at:String,
}
export interface newObj{
    id:String,
    title:String,
    storage_url:String,
    processing_status:String
};

export interface UploadState {
   video: newObj
};

export interface StatusState{
   loading:Boolean,
   failed:Boolean,
   success:Boolean  
};

export interface transcriptState{
   id:String,
   content:String,
   model_used:String,
   tone_version:String
};

export interface summaryState{
    id:String,
    text:String,
    type:String,
    model_used:String
};

export interface videoState{
   video:newObj,
   transcript:transcriptState,
   summary: summaryState
};

export interface BackedupState{
    id:String,
    user_id:String,
    video_id:String,
    title:String,
    description:null,
    storage_url:String,
    original_filename:String,
    duration_seconds:String,
    processing_status:String,
    created_at:String
}

export interface tok{
    token:String
}

export interface AllInOneState{
   auth:AuthState,
   status:StatusState,
   videoUpload:UploadState,
   video: videoState
   backedFile:BackedupState,
   token:tok
};