// factories.ts
export const createVideo = () => ({
  id: '',
  title: '',
  storage_url: '',
  processing_status: ''
});

export const createTranscript = () => ({
  id: '',
  content: '',
  model_used: '',
  tone_version: ''
});

export const createSummary = () => ({
  id: '',
  text: '',
  type: '',
  model_used: ''
});

export const createAuth = () => ({
  name: '',
  email: '',
  password_hash: '',
  subscription: null,
  status: null,
  id: '',
  created_at: '',
  updated_at: ''
});