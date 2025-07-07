"use client";

import TabPanel from "@/components/header/tab-panel";
import NoteContent from "@/components/notes/note-content";

export default function NotesWrapper() {
  return (
    <>
      <TabPanel />
      <NoteContent />
    </>
  );
}