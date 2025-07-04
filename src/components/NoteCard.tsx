import React from 'react';
import { Note } from '../types/note';
import { Pencil, Trash2, Square, CheckSquare } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'bg-purple-100 text-purple-800';
      case 'home':
        return 'bg-green-100 text-green-800';
      case 'personal':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
          {getCategoryName(note.category)}
        </span>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleComplete(note.id, !note.is_completed)}
            className="p-1.5 text-green-600 transition-colors"
            title={note.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {note.is_completed ? (
              <CheckSquare size={16} className="text-green-600" />
            ) : (
              <Square size={16} />
            )}
          </button>
          
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 text-yellow-600"
            title="Edit note"
          >
            <Pencil size={16} />
          </button>
          
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-red-600"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Note Kondisi */}
      <div className={`${note.is_completed ? 'opacity-60' : ''}`}>
        <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${note.is_completed ? 'line-through' : ''}`}>
          {note.title}
        </h3>
        
        {note.content && (
          <p className={`text-gray-600 text-sm mb-4 line-clamp-3 ${note.is_completed ? 'line-through' : ''}`}>
            {note.content}
          </p>
        )}
      </div>

      {/* Date */}
      <div className="text-xs text-gray-400 mt-auto">
        {formatDate(note.created_at)}
      </div>
    </div>
  );
};

export default NoteCard;