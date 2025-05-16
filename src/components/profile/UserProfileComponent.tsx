
import { useState } from "react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit2, Link, MapPin, Calendar, BookOpen, MessageCircle, User, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserProfileComponentProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const UserProfileComponent = ({ profile, isCurrentUser, onUpdateProfile }: UserProfileComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    website: profile.website,
    avatar: profile.avatar
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdateProfile({
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        website: formData.website,
        avatar: formData.avatar
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Avatar */}
          <div className="relative">
            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {profile.isGhostMode && (
              <Badge className="absolute bottom-2 right-2 bg-slate-700">Ghost Mode</Badge>
            )}
            {profile.status !== 'offline' && !profile.isGhostMode && (
              <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-4 border-background bg-green-500" />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.role === 'admin' && (
                <Badge variant="destructive" className="mt-2">Admin</Badge>
              )}
              {profile.role === 'moderator' && (
                <Badge variant="secondary" className="mt-2">Moderator</Badge>
              )}
            </div>
            
            <p className="text-muted-foreground">{profile.bio || "No bio provided yet."}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="hover:text-primary">
                    {profile.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined May 2023</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isCurrentUser && (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="activity">
          <TabsList className="mb-6">
            <TabsTrigger value="activity" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Connections</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No activity yet</p>
                    <p className="text-sm">Activities will appear here when {isCurrentUser ? 'you participate' : 'this user participates'} on the platform.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-6">
            <h2 className="text-xl font-bold">Shared Knowledge</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No shared knowledge yet</p>
                    <p className="text-sm">Contributions to the knowledge base will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="connections" className="space-y-6">
            <h2 className="text-xl font-bold">Connections</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-6 flex items-center justify-center h-64 text-muted-foreground">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No connections yet</p>
                    <p className="text-sm">Connect with other members of the community to see them here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-muted-foreground">Enter a URL for your profile picture.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="username"
                required
              />
              <p className="text-xs text-muted-foreground">This will be used in your profile URL.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://your-website.com"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
