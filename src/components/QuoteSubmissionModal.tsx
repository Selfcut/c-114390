import { useState } from "react";
import { X, Upload } from "lucide-react";
import { polymathToast } from "@/components/ui/use-toast";

interface QuoteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (text: string, author: string, category: string) => void;
  categories?: string[];
}

export const QuoteSubmissionModal = ({ 
  isOpen, 
  onClose,
  onSubmit,
  categories = []
}: QuoteSubmissionModalProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("philosophy");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send this data to the server
    console.log({
      quoteText,
      author,
      source,
      category,
      uploadedImage
    });
    
    // Call the provided onSubmit if it exists
    if (onSubmit) {
      onSubmit(quoteText, author, category);
    }
    
    // Show success toast
    polymathToast.contributionSaved();
    
    // Reset form and close modal
    setQuoteText("");
    setAuthor("");
    setSource("");
    setCategory("philosophy");
    setUploadedImage(null);
    onClose();
  };

  const defaultCategories = [
    { value: "philosophy", label: "Philosophy" },
    { value: "mysticism", label: "Mysticism" },
    { value: "science", label: "Science" },
    { value: "literature", label: "Literature" },
    { value: "alchemy", label: "Alchemy" },
    { value: "hermeticism", label: "Hermeticism" },
    { value: "gnosticism", label: "Gnosticism" },
    { value: "kabbalah", label: "Kabbalah" },
    { value: "astrology", label: "Astrology" },
    { value: "sacred-geometry", label: "Sacred Geometry" },
  ];

  const categoryOptions = categories.length > 0 
    ? categories.map(cat => ({ value: cat.toLowerCase(), label: cat }))
    : defaultCategories;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Share a Quote</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="quoteText" className="block text-sm font-medium text-gray-300">
              Quote Text*
            </label>
            <textarea
              id="quoteText"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3 min-h-[100px]"
              placeholder="Enter the quote text..."
              required
            ></textarea>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="author" className="block text-sm font-medium text-gray-300">
              Author*
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3"
              placeholder="Who said or wrote this?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="source" className="block text-sm font-medium text-gray-300">
              Source
            </label>
            <input
              type="text"
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3"
              placeholder="Book, speech, etc. (optional)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
              Category*
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md p-3"
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Add Image (optional)
            </label>
            <div className="border border-dashed border-gray-700 rounded-md p-6 text-center">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => setUploadedImage(e.target.files ? e.target.files[0] : null)}
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-300">
                  {uploadedImage ? uploadedImage.name : "Click to upload an image"}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </span>
              </label>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Submit Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
