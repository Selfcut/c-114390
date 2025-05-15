import { useState, useEffect } from 'react';
import { MessageCircle, BookOpen, Heart, ArrowRight, User, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface ActivityItem {
  id: string;
  type: 'discussion' | 'contribution' | 'event' | 'reaction';
  title: string;
  content: string;
  username: string;
  userAvatar?: string;
  timestamp: Date;
  likes: number;
  replies?: number;
  category?: string;
  isNew?: boolean;
  hasRead?: boolean;
  targetUrl?: string;
}

interface EnhancedCommunityActivityProps {
  className?: string;
}

export const EnhancedCommunityActivity = ({ className }: EnhancedCommunityActivityProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'discussions' | 'contributions' | 'events'>('all');
  
  useEffect(() => {
    // Simulate API fetch
    const fetchActivities = () => {
      setIsLoading(true);
      
      // Mock data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'discussion',
          title: 'Symbolism in Alchemical Texts',
          content: "Has anyone noticed the recurring symbols in traditional alchemical manuscripts? I've been studying the works of...",
          username: 'AlchemyExplorer',
          userAvatar: '/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 24,
          replies: 8,
          category: 'Alchemy',
          isNew: true,
          hasRead: false,
          targetUrl: '/forum'
        },
        {
          id: '2',
          type: 'contribution',
          title: 'New Translation: The Emerald Tablet',
          content: "I've completed a new translation of the Emerald Tablet with annotations comparing different historical versions...",
          username: 'HermeticScholar',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          likes: 45,
          category: 'Hermeticism',
          isNew: true,
          hasRead: true,
          targetUrl: '/library'
        },
        {
          id: '3',
          type: 'event',
          title: 'Online Workshop: Sacred Geometry Basics',
          content: 'Join us for an interactive workshop exploring the fundamental principles of Sacred Geometry and its applications...',
          username: 'GeometryMaster',
          timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          likes: 32,
          category: 'Sacred Geometry',
          isNew: false,
          hasRead: true,
          targetUrl: '/events'
        },
        {
          id: '4',
          type: 'reaction',
          title: 'Your Quote was Featured',
          content: 'Your submission "The universe is mental; all is mind" has been featured in our weekly wisdom collection!',
          username: 'SystemAdmin',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          likes: 0,
          isNew: true,
          hasRead: false,
          targetUrl: '/quotes'
        },
        {
          id: '5',
          type: 'discussion',
          title: 'Comparing Eastern & Western Mystical Traditions',
          content: "I've been researching parallels between Kabbalah and Taoist internal alchemy. The similarities in...",
          username: 'ComparativeMystic',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          likes: 37,
          replies: 15,
          category: 'Mysticism',
          isNew: false,
          hasRead: true,
          targetUrl: '/forum'
        }
      ];
      
      setTimeout(() => {
        setActivities(mockActivities);
        setIsLoading(false);
      }, 800);
    };
    
    fetchActivities();
  }, []);
  
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'discussions') return activity.type === 'discussion';
    if (filter === 'contributions') return activity.type === 'contribution';
    if (filter === 'events') return activity.type === 'event';
    return true;
  });
  
  const markAsRead = (id: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, hasRead: true } 
          : activity
      )
    );
  };
  
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'discussion':
        return <MessageCircle size={16} className="text-blue-400" />;
      case 'contribution':
        return <BookOpen size={16} className="text-green-400" />;
      case 'event':
        return <Calendar size={16} className="text-yellow-400" />;
      case 'reaction':
        return <Heart size={16} className="text-red-400" />;
      default:
        return <MessageCircle size={16} className="text-gray-400" />;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ${date > now ? 'from now' : 'ago'}`;
    }
    
    if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ${date > now ? 'from now' : 'ago'}`;
    }
    
    if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ${date > now ? 'from now' : 'ago'}`;
    }
    
    return 'Just now';
  };
  
  const navigateToActivity = (activity: ActivityItem) => {
    markAsRead(activity.id);
    
    toast({
      title: "Opening activity",
      description: `Navigating to ${activity.title}`
    });
  };
  
  return (
    <div className={cn('bg-[#1A1A1A] rounded-lg border border-gray-800', className)}>
      <div className="p-5 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Community Activity</h3>
          
          <div className="flex gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === 'all' 
                  ? 'bg-[#6E59A5] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('discussions')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === 'discussions' 
                  ? 'bg-[#6E59A5] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Discussions
            </button>
            <button 
              onClick={() => setFilter('contributions')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === 'contributions' 
                  ? 'bg-[#6E59A5] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Content
            </button>
            <button 
              onClick={() => setFilter('events')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === 'events' 
                  ? 'bg-[#6E59A5] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Events
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E59A5]"></div>
        </div>
      ) : filteredActivities.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              className={cn(
                "p-5 hover:bg-[#222] transition-colors relative cursor-pointer",
                !activity.hasRead && "border-l-2 border-[#6E59A5]"
              )}
              onClick={() => navigateToActivity(activity)}
            >
              {activity.isNew && (
                <div className="absolute top-4 right-4 bg-[#6E59A5] text-white text-[10px] px-2 py-0.5 rounded">
                  NEW
                </div>
              )}
              
              <div className="flex gap-3">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    {activity.userAvatar ? (
                      <img 
                        src={activity.userAvatar} 
                        alt={activity.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-full bg-gray-800">
                      {getActivityIcon(activity.type)}
                    </div>
                    <h4 className="text-white font-medium">
                      {activity.title}
                    </h4>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                    {activity.content}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">by {activity.username}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 text-xs">{formatTimestamp(activity.timestamp)}</span>
                      
                      {activity.category && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="bg-gray-800 text-xs text-gray-400 px-2 py-0.5 rounded-full">
                            {activity.category}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {activity.likes > 0 && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <Heart size={12} />
                          <span className="text-xs">{activity.likes}</span>
                        </div>
                      )}
                      
                      {activity.replies !== undefined && activity.replies > 0 && (
                        <div className="flex items-center gap-1 text-gray-400">
                          <MessageCircle size={12} />
                          <span className="text-xs">{activity.replies}</span>
                        </div>
                      )}
                      
                      <ArrowRight size={14} className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <MessageCircle size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-gray-400">No activity found</p>
          <p className="text-gray-500 text-sm mt-1">Check back later or adjust your filters</p>
        </div>
      )}
      
      <div className="p-4 border-t border-gray-800">
        <button 
          className="text-[#6E59A5] hover:text-[#7E69AB] font-medium transition-colors text-sm w-full text-center"
          onClick={() => {
            toast({
              title: "Loading more activities",
              description: "Fetching additional community updates"
            });
          }}
        >
          View More Activity
        </button>
      </div>
    </div>
  );
};
