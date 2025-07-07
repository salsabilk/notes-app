// components/notes/notes-content.tsx
"use client";

import { useState, useEffect } from "react";
import { Note, NoteCategory, CreateNoteData } from "@/types/note";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
// import { createNote, updateNote, deleteNote, toggleComplete } from "@/actions/note-action";
import toast, { Toaster } from "react-hot-toast";
import { useNotes } from "@/context/NoteContext"; // Import useNotes

interface NoteContentProps {
  // notes: Note[];
  // activeCategory: NoteCategory;
  // showCompletedOnly: boolean;
}

export default function NoteContent({
  // activeCategory,
  // showCompletedOnly
}: NoteContentProps) {
  // Ambil semua state dan fungsi dari Context
  const {
    notes,
    activeCategory,
    showCompletedOnly,
    isLoading, // Mengambil isLoading dari context
    addNote,
    editNote,
    removeNote,
    toggleNoteCompletion,
  } = useNotes();

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    let filtered = notes;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((note) => note.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by completion status
    if (showCompletedOnly) {
      filtered = filtered.filter((note) => note.is_completed);
    }

    setFilteredNotes(filtered);
  }, [notes, activeCategory, searchQuery, showCompletedOnly]);

  // Fungsi-fungsi handler sekarang memanggil fungsi dari Context
  const handleAddNote = async (noteData: CreateNoteData) => {
    try {
      await addNote(noteData); // Panggil fungsi dari Context
      setShowModal(false);
    } catch (error) {
      //
    }
  };

  const handleUpdateNote = async (noteData: CreateNoteData) => {
    if (!editingNote) return;

    try {
      await editNote(editingNote.id, noteData); // Panggil fungsi dari Context
      setShowModal(false);
      setEditingNote(null);
    } catch (error) {
      //
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await removeNote(id); // Panggil fungsi dari Context
    } catch (error) {
      //
    }
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      await toggleNoteCompletion(id, isCompleted); // Panggil fungsi dari Context
    } catch (error) {
      //
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowModal(true);
  };

  const handleModalSubmit = (noteData: CreateNoteData) => {
    if (editingNote) {
      handleUpdateNote(noteData);
    } else {
      handleAddNote(noteData);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Search and Add Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-600"
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-5 py-5 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={40} className="mr-2" />
          Add Note
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-lg mb-2">No notes found</div>
          <div className="text-sm">
            {searchQuery
              ? "Try a different search term"
              : showCompletedOnly
              ? "No completed notes yet"
              : activeCategory !== "all"
              ? `No notes in ${activeCategory} category`
              : "Create your first note to get started"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <NoteModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        editingNote={editingNote}
        isLoading={isLoading}
      />
    </>
  );
}