import React, { useState, useEffect } from 'react';
import { Note, CreateNoteData } from '../types/note';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNoteData) => void;
  editingNote?: Note | null;
  isLoading?: boolean;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingNote,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateNoteData>({
    title: '',
    content: '',
    category: 'personal'
  });

  // Reset form
  useEffect(() => {
    if (isOpen) {
      if (editingNote) {
        setFormData({
          title: editingNote.title,
          content: editingNote.content || '',
          category: editingNote.category
        });
      } else {
        setFormData({
          title: '',
          content: '',
          category: 'personal'
        });
      }
    }
  }, [isOpen, editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      category: 'personal'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white bg-opacity-98 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 border-opacity-50">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 border-opacity-50 rounded-t">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingNote ? 'Edit Note' : 'Add New Note'}
            </h2>
            <button 
              type="button" 
              onClick={handleClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:bg-opacity-30 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
              disabled={isLoading}
            >
              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 border-opacity-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 transition-all duration-200"
                  placeholder="Enter note title..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 border-opacity-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="personal">Personal</option>
                  <option value="home">Home</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 border-opacity-60 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 transition-all duration-200"
                  placeholder="Enter note content..."
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>

          {/* Modal footer */}
          <div className="flex items-center justify-end space-x-3 p-4 md:p-5 border-t border-gray-200 border-opacity-50 rounded-b">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 bg-opacity-70 border border-gray-300 border-opacity-60 rounded-md hover:bg-gray-200 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 backdrop-blur-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 bg-opacity-95 border border-transparent rounded-md hover:bg-blue-700 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={!formData.title.trim() || isLoading}
            >
              {isLoading ? 'Saving...' : editingNote ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;