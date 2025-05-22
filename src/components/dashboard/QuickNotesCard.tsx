
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useNotes } from '@/hooks/useNotes';
import { useAuth } from '@/lib/auth';
import { PenLine, Save, ExternalLink } from 'lucide-react';

export const QuickNotesCard = () => {
  const { user } = useAuth();
  const { 
    notes, 
    isLoading,
    createNote, 
    updateNote,
    useAutoSaveNote
  } = useNotes();

  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(undefined);
  const [content, setContent] = useState('');
  
  const { autoSaveStatus } = useAutoSaveNote(activeNoteId, content);

  // Set initial note when component loads
  useEffect(() => {
    if (!isLoading && notes.length > 0) {
      const latestNote = notes[0];
      setActiveNoteId(latestNote.id);
      setContent(latestNote.content);
    }
  }, [isLoading, notes]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const createNewNote = async () => {
    if (!user) return;
    
    try {
      const newNote = await createNote.mutateAsync({
        content: ''
      });
      
      setActiveNoteId(newNote.id);
      setContent('');
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  const handleManualSave = async () => {
    if (!activeNoteId || !content.trim()) return;
    
    try {
      await updateNote.mutateAsync({
        id: activeNoteId,
        noteData: { content }
      });
    } catch (error) {
      console.error('Error saving note:', error);
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <PenLine size={18} className="mr-2" />
            Quick Notes
          </CardTitle>
          <div className="flex items-center gap-2">
            {renderSaveStatus()}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
            >
              <Link to="/notes">
                <ExternalLink size={14} className="mr-1" />
                View all
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading notes...</p>
          </div>
        ) : (
          <Textarea
            placeholder="Write a quick note..."
            value={content}
            onChange={handleContentChange}
            className="min-h-[200px] resize-none"
            autoFocus
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={createNewNote}
        >
          New Note
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          onClick={handleManualSave}
          disabled={!content.trim() || autoSaveStatus === 'saving'}
        >
          <Save size={14} className="mr-1" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
