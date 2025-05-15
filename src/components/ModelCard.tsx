
import { ArrowRight, Plus } from "lucide-react";

interface Tag {
  label: string;
  variant: 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'red';
}

interface ModelCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  isTrainYourOwn?: boolean;
  tags?: Tag[];
}

export const ModelCard = ({
  title,
  subtitle,
  imageSrc,
  isTrainYourOwn = false,
  tags = []
}: ModelCardProps) => {
  const getTagColor = (variant: string) => {
    switch (variant) {
      case 'blue': return 'bg-blue-900 text-blue-200';
      case 'green': return 'bg-green-900 text-green-200';
      case 'yellow': return 'bg-yellow-900 text-yellow-200';
      case 'orange': return 'bg-orange-900 text-orange-200';
      case 'purple': return 'bg-purple-900 text-purple-200';
      case 'red': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-800 text-gray-200';
    }
  };

  return (
    <div className={`feature-card bg-muted rounded-lg overflow-hidden flex flex-col transition-all duration-300 ${isTrainYourOwn ? 'border-dashed border-2 border-gray-700' : ''}`}>
      {isTrainYourOwn ? (
        <div className="h-40 flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="p-3 rounded-full bg-blue-900 bg-opacity-50">
            <Plus size={24} className="text-blue-400" />
          </div>
        </div>
      ) : (
        <img
          src={imageSrc || 'https://via.placeholder.com/300x200'}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag.variant)}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto pt-4 flex justify-end">
          <button className="run-button bg-blue-600 text-white px-4 py-1.5 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium">
            <span>{isTrainYourOwn ? 'Create' : 'Explore'}</span>
            <ArrowRight size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
