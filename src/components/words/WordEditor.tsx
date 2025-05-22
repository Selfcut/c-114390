
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Word, WordCreateInput, WordUpdateInput } from '@/hooks/useWords';
import { X, Plus, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WordEditorProps {
  word?: Word;
  isEditing?: boolean;
  onSubmit: (wordData: WordCreateInput | WordUpdateInput) => void;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  'poem', 'story', 'essay', 'reflection', 'journal', 'letter', 'other'
];

export const WordEditor: React.FC<WordEditorProps> = ({ 
  word, 
  isEditing = false,
  onSubmit,
  isSubmitting = false
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(word?.title || '');
  const [content, setContent] = useState(word?.content || '');
  const [isPublic, setIsPublic] = useState(word?.is_public || false);
  const [category, setCategory] = useState(word?.category || 'other');
  const [tags, setTags] = useState<string[]>(word?.tags || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (word) {
      setTitle(word.title);
      setContent(word.content);
      setIsPublic(word.is_public);
      setCategory(word.category);
      setTags(word.tags || []);
    }
  }, [word]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter content');
      return;
    }
    
    onSubmit({
      title,
      content,
      is_public: isPublic,
      category,
      tags
    });
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Writing' : 'New Writing'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your writing"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, poem, story, or whatever inspires you..."
              className="min-h-[300px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="visibility"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="visibility" className="cursor-pointer">
                  {isPublic ? 'Public' : 'Private'}
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags and press Enter"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={addTag} 
                disabled={!tagInput.trim()}
              >
                <Plus size={16} className="mr-1" /> Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-xs rounded-full hover:bg-destructive/20 p-0.5"
                    >
                      <X size={12} />
                      <span className="sr-only">Remove {tag} tag</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/words')}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            <Save size={16} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
