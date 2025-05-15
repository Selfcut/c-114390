
import { Sparkles } from 'lucide-react';

interface Tag {
  label: string;
  variant: 'blue' | 'green' | 'orange' | 'yellow' | 'red';
}

interface ModelCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  tags?: Tag[];
  isTrainYourOwn?: boolean;
}

export const ModelCard = ({ title, subtitle, imageSrc, tags = [], isTrainYourOwn = false }: ModelCardProps) => {
  const getTagColorClass = (variant: string): string => {
    switch (variant) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-muted rounded-lg overflow-hidden border border-gray-800 hover-lift transition-transform">
      {isTrainYourOwn ? (
        <div className="h-40 bg-gradient-to-br from-blue-800 to-purple-900 flex items-center justify-center">
          <Sparkles className="text-white h-12 w-12" />
        </div>
      ) : (
        imageSrc && <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
      )}
      
      <div className="p-4">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-0.5 rounded ${getTagColorClass(tag.variant)}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        
        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm py-2 rounded-md">
          {isTrainYourOwn ? 'Create Now' : 'Explore'}
        </button>
      </div>
    </div>
  );
};
