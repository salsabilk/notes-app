"use client";

import { useState, useEffect } from "react";
import { Note, CreateNoteData } from "@/types/note";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
import { createNote, updateNote, deleteNote, toggleComplete } from "@/actions/note-action";
import toast, { Toaster } from "react-hot-toast";
import { useNotes } from "@/context/NoteContext"; // Import useNotes

export default function NoteContent() {
  // Mengambil semua state dan function dari Context
  const {
    notes,           // Array notes dari context
    setNotes,        // Function untuk mengupdate notes di context
    activeCategory,  // Kategori aktif dari context
    showCompletedOnly, // Filter status dari context
    isLoading,       // Loading state dari context
    setIsLoading,    // Function untuk mengubah loading state
  } = useNotes();    // Custom hook untuk mengakses context

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    let filtered = notes;         // Menggunakan notes dari context

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

    // Filter by completion status complete
    if (showCompletedOnly) {
      filtered = filtered.filter((note) => note.is_completed);
    }

    setFilteredNotes(filtered);
  }, [notes, activeCategory, searchQuery, showCompletedOnly]);

  // Fungsi untuk menangani penambahan note baru
  const handleAddNote = async (noteData: CreateNoteData) => {
    try {
      setIsLoading(true);       // Mengubah loading state di context
      const newNote = await createNote(noteData);
      setNotes(prev => [newNote, ...prev]);   // Update notes di context
      setShowModal(false);
      toast.success('Note added successfully!');
    } catch (error) {
      toast.error('Failed to add note');
      console.error('Error adding note:', error);
    } finally {
      setIsLoading(false);     // Reset loading state di context
    }
  };

  // Fungsi untuk menangani update note
  const handleUpdateNote = async (noteData: CreateNoteData) => {
    if (!editingNote) return;

    try {
      setIsLoading(true);
      const updatedNote = await updateNote(editingNote.id, noteData);
      
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id ? updatedNote : note
      ));
      
      setShowModal(false);
      setEditingNote(null);
      toast.success('Note updated successfully!');
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani penghapusan note
  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Note deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Error deleting note:', error);
    }
  };

  // Fungsi untuk menangani toggle completion status
  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const updatedNote = await toggleComplete(id, isCompleted);
      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));
      toast.success(isCompleted ? 'Note marked as completed!' : 'Note marked as incomplete!');
    } catch (error) {
      toast.error('Failed to update note status');
      console.error('Error toggling note status:', error);
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
          className="inline-flex items-center px-5 py-5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus size={40} />
          Add
        </Button>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-lg mb-2">No notes found</div>
          <div className="text-sm">
            {searchQuery ? 'Try a different search term' : 
             showCompletedOnly ? 'No completed notes yet' :
             activeCategory !== 'all' ? `No notes in ${activeCategory} category` :
             'Create your first note to get started'}
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