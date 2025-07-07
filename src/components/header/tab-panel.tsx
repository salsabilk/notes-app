// components/header/tab-panel.tsx
"use client";

import { Note, NoteCategory } from "@/types/note";
import { CheckSquare } from "lucide-react";
import { useNotes } from "@/context/NoteContext"; // Import useNotes

interface TabPanelProps {
  // Props ini tidak perlu lagi karena akan diambil dari Context
  // notes: Note[];
  // activeCategory: NoteCategory;
  // showCompletedOnly: boolean;
  // onCategoryChange: (category: NoteCategory) => void;
  // onCompletedToggle: (showCompleted: boolean) => void;
}

export default function TabPanel({
  // notes, // Hapus dari destructuring props
  // activeCategory,
  // showCompletedOnly,
  // onCategoryChange,
  // onCompletedToggle
}: TabPanelProps) {
  // Ambil state dan fungsi dari Context
  const { notes, activeCategory, showCompletedOnly, setActiveCategory, setShowCompletedOnly } = useNotes();

  const getCategoryCount = (category: NoteCategory) => {
    if (category === "all") return notes.length;
    return notes.filter((note) => note.category === category).length;
  };

  const categories = [
    { key: "all" as NoteCategory, label: "ALL", count: getCategoryCount("all") },
    { key: "personal" as NoteCategory, label: "PERSONAL", count: getCategoryCount("personal") },
    { key: "home" as NoteCategory, label: "HOME", count: getCategoryCount("home") },
    { key: "business" as NoteCategory, label: "BUSINESS", count: getCategoryCount("business") },
  ];

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your notes</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex space-x-6">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)} // Panggil fungsi dari Context
              className={`pb-2 text-sm font-medium transition-colors ${
                activeCategory === category.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-1 text-xs text-gray-400">
                  ({category.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showCompleted"
            checked={showCompletedOnly}
            onChange={(e) => setShowCompletedOnly(e.target.checked)} // Panggil fungsi dari Context
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="showCompleted" className="text-sm text-gray-600 flex items-center">
            <CheckSquare size={16} className="mr-1" />
            Show only completed notes
          </label>
        </div>
      </div>
    </div>
  );
}