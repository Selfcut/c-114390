
import React, { useState } from "react";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/hooks/useNotes";
import { Plus, Save, Trash2, Search } from "lucide-react";

const Notes = () => {
  const { notes, isLoading, createNote, updateNote, deleteNote, useAutoSaveNote } = useNotes();
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Auto-save for editing note
  const { autoSaveStatus } = useAutoSaveNote(editingId || undefined, editContent);

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (!confirm('Are you sure you want to delete this note?')) return;
    
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

  return (
    <PageLayout>
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notes</h1>
          {autoSaveStatus === 'saving' && (
            <span className="text-sm text-muted-foreground">Saving...</span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-sm text-green-600">Saved</span>
          )}
          {autoSaveStatus === 'error' && (
            <span className="text-sm text-red-600">Error saving</span>
          )}
        </div>

        {/* Create New Note */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[120px]"
            />
            <Button 
              onClick={handleCreateNote} 
              className="w-full"
              disabled={!newNote.trim() || isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-6">
                  {editingId === note.id ? (
                    <div className="space-y-4">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Created: {new Date(note.created_at).toLocaleDateString()}</p>
                          <p>Updated: {new Date(note.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditNote(note.id, note.content)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteNote(note.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No notes found matching your search.' : 'No notes yet. Create your first note above!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Notes;
