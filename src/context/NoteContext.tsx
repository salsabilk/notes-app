// context/NoteContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Note, NoteCategory, CreateNoteData, UpdateNoteData } from "@/types/note";
import {
  createNote as createNoteAction,
  updateNote as updateNoteAction,
  deleteNote as deleteNoteAction,
  toggleComplete as toggleCompleteAction,
} from "@/actions/note-action";
import toast from "react-hot-toast";

interface NoteContextType {
  notes: Note[];
  activeCategory: NoteCategory;
  showCompletedOnly: boolean;
  isLoading: boolean; 
  setActiveCategory: (category: NoteCategory) => void;
  setShowCompletedOnly: (show: boolean) => void;
  addNote: (noteData: CreateNoteData) => Promise<void>;
  editNote: (id: string, noteData: UpdateNoteData) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  toggleNoteCompletion: (id: string, isCompleted: boolean) => Promise<void>;
}

// Buat Context
const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Buat Provider Component
interface NoteProviderProps {
  initialNotes: Note[]; 
  children: React.ReactNode;
}

export const NoteProvider = ({ initialNotes, children }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("all");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Fungsi untuk operasi CRUD notes
  const addNote = useCallback(async (noteData: CreateNoteData) => {
    setIsLoading(true);
    try {
      const newNote = await createNoteAction(noteData);
      setNotes((prev) => [newNote, ...prev]);
      toast.success("Note added successfully!");
    } catch (error) {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editNote = useCallback(async (id: string, noteData: UpdateNoteData) => {
    setIsLoading(true);
    try {
      const updatedNote = await updateNoteAction(id, noteData);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeNote = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNoteAction(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
      throw error;
    }
  }, []);

  const toggleNoteCompletion = useCallback(async (id: string, isCompleted: boolean) => {
    try {
      const updatedNote = await toggleCompleteAction(id, isCompleted);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      toast.success(
        isCompleted ? "Note marked as completed!" : "Note marked as incomplete!"
      );
    } catch (error) {
      toast.error("Failed to update note status");
      console.error("Error toggling note status:", error);
      throw error;
    }
  }, []);

  const value = {
    notes,
    activeCategory,
    showCompletedOnly,
    isLoading,
    setActiveCategory,
    setShowCompletedOnly,
    addNote,
    editNote,
    removeNote,
    toggleNoteCompletion,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

// Buat Custom Hook untuk Menggunakan Context
export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
};