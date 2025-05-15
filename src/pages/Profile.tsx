
import { useState } from "react";
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Brain,
  Sparkles,
  Trophy,
  Star,
  Users,
  MessageSquare,
  Lightbulb,
  Edit,
  Calendar,
  Clock,
  AtSign,
  GraduationCap,
  Bookmark
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DiscussionTopicCard } from "../components/DiscussionTopicCard";
import { KnowledgeEntryCard } from "../components/KnowledgeEntryCard";

// Sample profile data (will be replaced with Supabase data)
const profileData = {
  id: "user-1",
  name: "Alex Morgan",
  username: "alexmorgan",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  coverImage: "/lovable-uploads/739ab3ed-442e-42fb-9219-25ee697b73ba.png",
  bio: "Philosopher, mathematician, and science enthusiast. Exploring the intersection of quantum physics and consciousness.",
  iq: 142,
  level: 12,
  xp: 8750,
  nextLevelXp: 10000,
  reputation: 3240,
  joinDate: "March 2024",
  lastActive: "Today",
  location: "San Francisco, CA",
  fields: ["Quantum Physics", "Philosophy of Mind", "Mathematics"],
  education: "Ph.D. Theoretical Physics",
  contributions: 87,
  following: 128,
  followers: 256,
  totalPosts: 42,
  badges: [
    { id: "1", name: "Early Adopter", icon: "sparkles" },
    { id: "2", name: "Top Contributor", icon: "trophy" },
    { id: "3", name: "Knowledge Seeker", icon: "brain" },
    { id: "4", name: "Polymath", icon: "book" }
  ]
};

// Sample contributions
const sampleContributions = [
  {
    id: "1",
    title: "Introduction to Quantum Consciousness",
    author: profileData.name,
    authorAvatar: profileData.avatar,
    date: "2 weeks ago",
    tags: ["Quantum Physics", "Consciousness", "Philosophy"],
    upvotes: 124,
    replies: 37,
    views: 842,
    isPinned: false,
    isPopular: true,
    isNew: false,
    excerpt: "An exploration of how quantum mechanics might relate to consciousness and cognition.",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Mathematical Models of Self-Reference",
    author: profileData.name,
    authorAvatar: profileData.avatar,
    date: "1 month ago",
    tags: ["Mathematics", "Logic", "Self-Reference"],
    upvotes: 89,
    replies: 23,
    views: 567,
    isPinned: false,
    isPopular: false,
    isNew: false,
    excerpt: "Examining Gödel's incompleteness theorems and their implications for AI consciousness.",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
];

// Sample bookmarked content
const sampleBookmarks = [
  {
    id: "1",
    title: "The Nature of Information in Physical Systems",
    author: "QuantumScholar",
    readTime: "18 min read",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    summary: "An exploration of information theory and its relationship to quantum mechanics and thermodynamics.",
    categories: ["Information Theory", "Quantum Physics", "Thermodynamics"],
    coverImage: "/lovable-uploads/a3dc041f-fb55-4108-807b-ca52164461d8.png"
  },
  {
    id: "2",
    title: "Consciousness: A Physicist's Perspective",
    author: "MindExplorer",
    readTime: "15 min read",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    summary: "A deep dive into current physical theories of consciousness and their limitations.",
    categories: ["Consciousness", "Physics", "Neuroscience"],
    coverImage: "/lovable-uploads/d8b5e246-d962-466e-ad7d-61985e448fb9.png"
  }
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Check if viewing own profile or another user's profile
  const isOwnProfile = true; // This would be determined by comparing the profile ID to the logged-in user ID
  
  // Calculate level progress percentage
  const levelProgressPercentage = (profileData.xp / profileData.nextLevelXp) * 100;
  
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main>
              {/* Cover Image */}
              <div 
                className="h-64 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${profileData.coverImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                {isOwnProfile && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute bottom-4 right-4"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit size={16} className="mr-2" />
                    {isEditing ? "Save Profile" : "Edit Profile"}
                  </Button>
                )}
              </div>
              
              {/* Profile Header */}
              <div className="container px-4 md:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 relative z-10 mb-8">
                  <Avatar className="h-32 w-32 border-4 border-background">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{profileData.name}</h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Level {profileData.level}
                        </Badge>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          <Brain size={14} className="mr-1" />
                          IQ {profileData.iq}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <AtSign size={14} className="mr-1" />
                      {profileData.username}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{profileData.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileData.fields.map((field, index) => (
                        <Badge key={index} variant="secondary">
                          {field}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5" />
                        Joined {profileData.joinDate}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1.5" />
                        Last active: {profileData.lastActive}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap size={14} className="mr-1.5" />
                        {profileData.education}
                      </div>
                    </div>
                  </div>
                  {!isOwnProfile && (
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button>Follow</Button>
                      <Button variant="outline">Message</Button>
                    </div>
                  )}
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">XP</p>
                        <p className="text-2xl font-bold">{profileData.xp}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles size={20} className="text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reputation</p>
                        <p className="text-2xl font-bold">{profileData.reputation}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Star size={20} className="text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Followers</p>
                        <p className="text-2xl font-bold">{profileData.followers}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users size={20} className="text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contributions</p>
                        <p className="text-2xl font-bold">{profileData.contributions}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Lightbulb size={20} className="text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Level Progress */}
                <Card className="mb-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy size={18} className="mr-2 text-amber-500" />
                      Progress to Level {profileData.level + 1}
                    </CardTitle>
                    <CardDescription>
                      {profileData.xp} / {profileData.nextLevelXp} XP
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={levelProgressPercentage} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Level {profileData.level}</span>
                      <span>Level {profileData.level + 1}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Badges */}
                <Card className="mb-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Earned Badges</CardTitle>
                    <CardDescription>
                      Achievements and recognitions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {profileData.badges.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                            {badge.icon === "sparkles" && <Sparkles size={24} className="text-primary" />}
                            {badge.icon === "trophy" && <Trophy size={24} className="text-amber-500" />}
                            {badge.icon === "brain" && <Brain size={24} className="text-blue-500" />}
                            {badge.icon === "book" && <Book size={24} className="text-emerald-500" />}
                          </div>
                          <span className="text-sm font-medium">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Content Tabs */}
                <Tabs defaultValue="contributions" className="mb-8">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="contributions">
                      <MessageSquare size={16} className="mr-2" />
                      Contributions
                    </TabsTrigger>
                    <TabsTrigger value="bookmarks">
                      <Bookmark size={16} className="mr-2" />
                      Bookmarks
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                      <Clock size={16} className="mr-2" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="contributions" className="space-y-4">
                    {sampleContributions.length > 0 ? (
                      <div className="space-y-4">
                        {sampleContributions.map(contribution => (
                          <DiscussionTopicCard
                            key={contribution.id}
                            discussion={contribution}
                            onClick={() => {}}
                          />
                        ))}
                        {sampleContributions.length > 2 && (
                          <Button variant="outline" className="w-full">
                            View All Contributions
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted rounded-lg p-8 text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No contributions yet</h3>
                        <p className="text-muted-foreground mb-4">
                          This user hasn't made any contributions yet.
                        </p>
                        {isOwnProfile && (
                          <Button>Create Your First Post</Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="bookmarks" className="space-y-4">
                    {sampleBookmarks.length > 0 ? (
                      <div className="space-y-4">
                        {sampleBookmarks.map(bookmark => (
                          <KnowledgeEntryCard
                            key={bookmark.id}
                            title={bookmark.title}
                            author={bookmark.author}
                            readTime={bookmark.readTime}
                            createdAt={bookmark.createdAt}
                            summary={bookmark.summary}
                            categories={bookmark.categories}
                            coverImage={bookmark.coverImage}
                            onClick={() => {}}
                          />
                        ))}
                        {sampleBookmarks.length > 2 && (
                          <Button variant="outline" className="w-full">
                            View All Bookmarks
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-muted rounded-lg p-8 text-center">
                        <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't bookmarked any content yet.
                        </p>
                        <Button>Browse Library</Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="activity" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Trophy size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Earned the "Knowledge Seeker" badge</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <MessageSquare size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Posted in "Quantum Mechanics Forum"</p>
                          <p className="text-sm text-muted-foreground">1 week ago</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                          <Users size={20} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">Joined "Philosophy of Mind" group</p>
                          <p className="text-sm text-muted-foreground">2 weeks ago</p>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Full Activity History
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
