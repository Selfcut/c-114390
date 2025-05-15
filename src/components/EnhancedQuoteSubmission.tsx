
import { useState } from 'react';
import { Quote, X, Image } from 'lucide-react';
import { polymathToast } from "./ui/use-toast";

interface EnhancedQuoteSubmissionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedQuoteSubmission = ({ isOpen, onClose }: EnhancedQuoteSubmissionProps) => {
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const categories = [
    "Philosophy", "Mysticism", "Hermeticism", "Gnosticism", 
    "Kabbalah", "Alchemy", "Astrology", "Sacred Geometry"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would save to the database
    console.log({ quoteText, author, source, category, imageUrl });
    
    // Show success toast
    polymathToast.quoteSubmitted();
    
    // Reset form
    setQuoteText('');
    setAuthor('');
    setSource('');
    setCategory('');
    setImageUrl('');
    
    // Close modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl w-full max-w-2xl relative overflow-hidden animate-fade-in">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-full bg-[#360036]">
              <Quote size={20} className="text-[#FF3EA5]" />
            </div>
            <h2 className="text-xl font-bold text-white">Share Wisdom</h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="quote-text" className="block text-sm text-gray-400 mb-1">Quote Text</label>
                <textarea
                  id="quote-text"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Enter the quote text..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white min-h-[100px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm text-gray-400 mb-1">Author</label>
                  <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Who said this?"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="source" className="block text-sm text-gray-400 mb-1">Source (Optional)</label>
                  <input
                    id="source"
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Book, speech, etc."
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="image-url" className="block text-sm text-gray-400 mb-1">Background Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    id="image-url"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
                  />
                  <button
                    type="button"
                    className="bg-gray-700 p-3 rounded-md text-gray-300 hover:bg-gray-600"
                    title="Choose from library"
                  >
                    <Image size={20} />
                  </button>
                </div>
              </div>
              
              {imageUrl && (
                <div className="border border-gray-700 rounded-md p-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 rounded-md text-white mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md text-white"
              >
                Submit Quote
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
