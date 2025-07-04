export interface Note {
  id: string;
  title: string;
  content?: string;
  category: 'personal' | 'home' | 'business';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type NoteCategory = 'all' | 'personal' | 'home' | 'business';

export interface CreateNoteData {
  title: string;
  content?: string;
  category: 'personal' | 'home' | 'business';
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: 'personal' | 'home' | 'business';
  is_completed?: boolean;
}