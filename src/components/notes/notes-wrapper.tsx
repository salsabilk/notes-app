// components/notes/notes-wrapper.tsx
"use client";

import { useState } from "react"; // useState ini tidak lagi dibutuhkan untuk kategori/completed
import { Note, NoteCategory } from "@/types/note"; // Import NoteCategory
import TabPanel from "@/components/header/tab-panel";
import NoteContent from "@/components/notes/note-content";
import { useNotes } from "@/context/NoteContext"; // Import useNotes

export default function NotesWrapper() {
  const { notes, activeCategory, showCompletedOnly, setActiveCategory, setShowCompletedOnly } = useNotes();

  return (
    <>
      <TabPanel />
      <NoteContent />
    </>
  );
}