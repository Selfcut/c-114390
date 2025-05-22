
import React, { useState } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { useNotes, Note } from '@/hooks/useNotes';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Calendar, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotesPage = () => {
  const { 
    notes, 
    isLoading, 
    createNote, 
    updateNote, 
    deleteNote,
    useAutoSaveNote
  } = useNotes();
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { autoSaveStatus } = useAutoSaveNote(
    selectedNote?.id,
    content
  );
  
  const filteredNotes = notes.filter(note => 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setContent(note.content);
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote.mutateAsync({
        content: ''
      });
      
      setSelectedNote(newNote);
      setContent('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleManualSave = async () => {
    if (!selectedNote) return;
    
    try {
      await updateNote.mutateAsync({
        id: selectedNote.id,
        noteData: { content }
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(id);
        
        if (selectedNote?.id === id) {
          setSelectedNote(null);
          setContent('');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const renderSaveStatus = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <span className="text-xs text-muted-foreground">Saving...</span>;
      case 'saved':
        return <span className="text-xs text-green-500">Saved</span>;
      case 'error':
        return <span className="text-xs text-destructive">Error saving</span>;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Notes</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleCreateNote} 
                className="ml-2"
                size="sm"
              >
                <Plus size={16} className="mr-1" />
                New
              </Button>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">Loading notes...</div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-4 text-center">
                  {searchQuery ? 'No matching notes found' : 'No notes yet, create your first one!'}
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div 
                    key={note.id}
                    className={`cursor-pointer border p-3 rounded-md ${
                      selectedNote?.id === note.id ? 'border-primary bg-muted/50' : 'border-border'
                    }`}
                    onClick={() => handleSelectNote(note)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete note</span>
                      </Button>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {note.content || 'Empty note'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {selectedNote ? 'Edit Note' : 'Select a note to edit'}
                  </CardTitle>
                  {selectedNote && renderSaveStatus()}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <Textarea
                  value={content}
                  onChange={handleUpdateContent}
                  placeholder="Write your note here..."
                  className="min-h-[400px]"
                  disabled={!selectedNote}
                />
              </CardContent>
              
              <CardFooter className="justify-end">
                <Button 
                  disabled={!selectedNote || !content.trim()}
                  onClick={handleManualSave}
                >
                  <Save size={16} className="mr-2" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotesPage;
