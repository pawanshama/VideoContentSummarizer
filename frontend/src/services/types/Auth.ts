import { JSX, SetStateAction } from "react"

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
export interface summarState{
   created_at: String,
   id:string,
   model_used:String,
   summary_text:string,
   summary_type:string,
   tone_version:null,
   public_id:String|any,
   transcript_id: string
}

export interface AllInOneState{
   auth:AuthState,
   status:StatusState,
   videoUpload:UploadState,
   video: videoState
   summar:summarState[],
   token:tok
};
export interface SideClickThreeButtonProps{
  clicked: {
    isClicked: boolean,
    sum:summarState,
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>,
    id:string,
    setNumberToShow: React.Dispatch<SetStateAction<number>>
   }
};