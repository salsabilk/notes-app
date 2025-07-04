"use client";

import { useState } from "react";
import { Note, NoteCategory } from "@/types/note";
import TabPanel from "@/components/header/tab-panel";
import NoteContent from "@/components/notes/note-content";

interface NotesWrapperProps {
  initialNotes: Note[];
}

export default function NotesWrapper({ initialNotes }: NotesWrapperProps) {
  const [activeCategory, setActiveCategory] = useState<NoteCategory>('all');
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  return (
    <>
      <TabPanel 
        notes={initialNotes} 
        activeCategory={activeCategory}
        showCompletedOnly={showCompletedOnly}
        onCategoryChange={setActiveCategory}
        onCompletedToggle={setShowCompletedOnly}
      />
      <NoteContent 
        notes={initialNotes} 
        activeCategory={activeCategory}
        showCompletedOnly={showCompletedOnly}
      />
    </>
  );
}