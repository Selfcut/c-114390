
import { useState } from "react";
import { X, Upload, Info, Image, AlertTriangle } from "lucide-react";
import { polymathToast } from "@/components/ui/use-toast";

interface CategoryOption {
  value: string;
  label: string;
}

interface QuoteSubmissionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: (text: string, author: string, category: string) => void;
  categories?: string[];
}

export const EnhancedQuoteSubmission = ({ 
  isOpen = true, 
  onClose,
  onSubmit,
  categories = []
}: QuoteSubmissionModalProps) => {
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("philosophy");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [step, setStep] = useState<'quote' | 'details' | 'preview'>('quote');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  if (!isOpen) return null;

  const validateQuote = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (quoteText.trim().length < 10) {
      newErrors.quoteText = "Quote must be at least 10 characters";
    }
    
    if (step === 'details' && author.trim().length < 2) {
      newErrors.author = "Author name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (validateQuote()) {
      if (step === 'quote') setStep('details');
      else if (step === 'details') setStep('preview');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('quote');
    else if (step === 'preview') setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuote()) return;
    
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
    setImagePreview(null);
    setStep('quote');
    onClose();
  };

  const categoryOptions: CategoryOption[] = [
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

  // If categories are passed as props, convert them to CategoryOption[] format
  const availableCategories: CategoryOption[] = categories.length > 0 
    ? categories.map(cat => ({ value: cat.toLowerCase(), label: cat }))
    : categoryOptions;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className={`w-3 h-3 rounded-full ${step === 'quote' ? 'bg-blue-600' : 'bg-gray-600'} mr-1`}></div>
      <div className={`w-12 h-1 ${step === 'quote' || step === 'details' ? 'bg-blue-600' : 'bg-gray-600'} mr-1`}></div>
      <div className={`w-3 h-3 rounded-full ${step === 'details' ? 'bg-blue-600' : 'bg-gray-600'} mr-1`}></div>
      <div className={`w-12 h-1 ${step === 'preview' ? 'bg-blue-600' : 'bg-gray-600'} mr-1`}></div>
      <div className={`w-3 h-3 rounded-full ${step === 'preview' ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
    </div>
  );

  const renderQuoteStep = () => (
    <div className="space-y-4 fade-in">
      <div className="space-y-2">
        <label htmlFor="quoteText" className="block text-sm font-medium text-gray-300">
          Quote Text*
        </label>
        <textarea
          id="quoteText"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          className={`w-full bg-gray-800 text-white border ${errors.quoteText ? 'border-red-500' : 'border-gray-700'} rounded-md p-3 min-h-[150px]`}
          placeholder="Enter the quote text..."
          required
        ></textarea>
        {errors.quoteText && (
          <div className="text-red-500 text-xs flex items-center mt-1">
            <AlertTriangle size={12} className="mr-1" />
            {errors.quoteText}
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors button-hover-effect"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4 fade-in">
      <div className="space-y-2">
        <label htmlFor="author" className="block text-sm font-medium text-gray-300">
          Author*
        </label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={`w-full bg-gray-800 text-white border ${errors.author ? 'border-red-500' : 'border-gray-700'} rounded-md p-3`}
          placeholder="Who said or wrote this?"
          required
        />
        {errors.author && (
          <div className="text-red-500 text-xs flex items-center mt-1">
            <AlertTriangle size={12} className="mr-1" />
            {errors.author}
          </div>
        )}
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
          {availableCategories.map((cat) => (
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
        <div className={`border border-dashed ${imagePreview ? 'border-blue-500' : 'border-gray-700'} rounded-md p-6 text-center`}>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center cursor-pointer"
          >
            {imagePreview ? (
              <div className="mb-2">
                <img 
                  src={imagePreview} 
                  alt="Quote backdrop preview" 
                  className="max-h-32 rounded"
                />
              </div>
            ) : (
              <Image className="h-10 w-10 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-300">
              {uploadedImage ? uploadedImage.name : "Click to upload an image"}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors button-hover-effect"
        >
          Preview
        </button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6 fade-in">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {imagePreview && (
          <div className="relative w-full h-40">
            <img 
              src={imagePreview} 
              alt="Quote backdrop" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-4">
          <blockquote className="text-white text-lg font-medium mb-2 italic">
            "{quoteText}"
          </blockquote>
          
          <div className="text-gray-400 text-sm">
            <span className="font-medium text-white">{author}</span>
            {source && <span> • {source}</span>}
          </div>
          
          <div className="mt-3">
            <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
              {availableCategories.find(cat => cat.value === category)?.label}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-3 flex items-start">
        <Info size={18} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-300">
          By sharing this quote, you certify that it doesn't violate any intellectual property rights.
          Please ensure proper attribution is given to the author.
        </p>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors button-hover-effect"
        >
          Submit Quote
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-[#1A1A1A] rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            {step === 'quote' && "Share a Quote"}
            {step === 'details' && "Quote Details"}
            {step === 'preview' && "Preview Your Quote"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {renderStepIndicator()}
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {step === 'quote' && renderQuoteStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'preview' && renderPreviewStep()}
        </form>
      </div>
    </div>
  );
};
