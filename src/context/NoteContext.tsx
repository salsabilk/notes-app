"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { Note, NoteCategory } from "@/types/note";

interface NoteContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;     // Function untuk mengupdate state notes (dari useState)
  activeCategory: NoteCategory;
  showCompletedOnly: boolean;                                 // Boolean untuk menampilkan hanya notes yang completed
  isLoading: boolean;                                         // Boolean untuk status loading
  setActiveCategory: (category: NoteCategory) => void;        // Function setter untuk mengubah state
  setShowCompletedOnly: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

// Membuat context baru dengan type NoteContextType atau undefined
const NoteContext = createContext<NoteContextType | undefined>(undefined);

// Buat Provider Component
interface NoteProviderProps {
  initialNotes: Note[];       // Props untuk menerima notes awal 
  children: React.ReactNode;  // Props untuk menerima children
}

// Component yang akan membungkus komponen lain dan menyediakan context
// Menerima initialNotes dan children sebagai props
export const NoteProvider = ({ initialNotes, children }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);                   // State untuk menyimpan array notes, diinisialisasi dengan initialNotes
  const [activeCategory, setActiveCategory] = useState<NoteCategory>("all");  // State untuk kategori aktif, default "all"
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mengupdate state notes ketika initialNotes berubah
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Object yang berisi semua state dan function yang akan dibagikan ke komponen children
  // value yang akan tersedia di context
  const value = {
    notes,
    setNotes,
    activeCategory,
    showCompletedOnly,
    isLoading,
    setActiveCategory,
    setShowCompletedOnly,
    setIsLoading,
  };

  // Mengembalikan Provider dengan value yang sudah disiapkan
  // Komponen children akan menerima context ini
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

// Buat Custom Hook untuk Menggunakan Context
export const useNotes = () => {
  const context = useContext(NoteContext);    // Mengambil nilai dari context
  if (context === undefined) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context; // Return context value yang berisi semua state dan functions
};