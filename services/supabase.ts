import { createClient } from '@supabase/supabase-js';
import { GeneratedEmail } from '../types';

const SUPABASE_URL = 'https://dgbrdmccaxgsknluxcre.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYnJkbWNjYXhnc2tubHV4Y3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNzg0OTAsImV4cCI6MjA3Mjg1NDQ5MH0.k7gU0a67nWOApF7DdDSH_x2Ihsy64M8ZRbby7qnrc2U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signInWithMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
  return { error };
};

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { error };
};

export const signUpWithEmailPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmailPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export interface CommunityCreation {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  snippet: string;
  author_name: string;
  created_at: string;
  likes_count: number;
  remix_count: number;
}

export const fetchCommunityCreations = async (): Promise<CommunityCreation[]> => {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creations:', error);
    return [];
  }
  return data as CommunityCreation[];
};

export const publishCreation = async (
  draft: GeneratedEmail, 
  userId: string, 
  authorName: string = 'Anonymous'
) => {
  const snippet = draft.body.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  const { data, error } = await supabase
    .from('creations')
    .insert([
      {
        user_id: userId,
        subject: draft.subject,
        body: draft.body,
        snippet: snippet,
        author_name: authorName,
        is_public: true,
      }
    ])
    .select();

  return { data, error };
};