
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

export const QuickNotesCard = () => {
  const { notes, isLoading, createNote, updateNote, deleteNote, useAutoSaveNote } = useNotes();
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Auto-save for editing note
  const { autoSaveStatus } = useAutoSaveNote(editingId || undefined, editContent);

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await createNote(newNote);
      setNewNote('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditNote = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return;
    
    try {
      await updateNote(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Quick Notes
          <span className="text-sm text-muted-foreground">
            {autoSaveStatus === 'saving' && 'Saving...'}
            {autoSaveStatus === 'saved' && 'Saved'}
            {autoSaveStatus === 'error' && 'Error saving'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create new note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Write a quick note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
          <Button 
            onClick={handleCreateNote} 
            size="sm" 
            className="w-full"
            disabled={!newNote.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Display notes */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notes.slice(0, 5).map((note) => (
            <div
              key={note.id}
              className="border rounded-lg p-3 space-y-2"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">{note.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleEditNote(note.id, note.content)}
                        variant="ghost"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteNote(note.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet. Create your first note above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
