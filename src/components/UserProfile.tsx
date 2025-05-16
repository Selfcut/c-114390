
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PencilLine, User, BookOpen, MessageSquare, Calendar, Save } from "lucide-react";
import { ProfileContributions } from "./ProfileContributions";
import { ProfileActivity } from "./ProfileActivity";
import { ProfileBadges } from "./ProfileBadges";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  profile: any;
  isCurrentUser: boolean;
  onUpdateProfile?: (updates: any) => Promise<void>;
}

export const UserProfile = ({ profile, isCurrentUser, onUpdateProfile }: UserProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    username: profile.username || '',
    bio: profile.bio || '',
    website: profile.website || '',
    avatarUrl: profile.avatar_url || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCurrentUser || !onUpdateProfile) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare updates object with only changed fields
      const updates = {
        name: formData.name !== profile.name ? formData.name : undefined,
        username: formData.username !== profile.username ? formData.username : undefined,
        bio: formData.bio !== profile.bio ? formData.bio : undefined,
        website: formData.website !== profile.website ? formData.website : undefined,
        avatar_url: formData.avatarUrl !== profile.avatar_url ? formData.avatarUrl : undefined
      };
      
      // Filter out undefined values
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );
      
      // Only update if there are changes
      if (Object.keys(filteredUpdates).length > 0) {
        await onUpdateProfile(filteredUpdates);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Something went wrong while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-40 w-40">
                <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} />
                <AvatarFallback>
                  <User size={50} />
                </AvatarFallback>
              </Avatar>
              
              {isCurrentUser && !isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4" 
                  onClick={() => setIsEditing(true)}
                >
                  <PencilLine className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Your name"
                        className="w-full" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="Username"
                        className="w-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleChange} 
                      placeholder="Tell us about yourself"
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="Your website URL"
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input 
                      id="avatarUrl" 
                      name="avatarUrl" 
                      value={formData.avatarUrl} 
                      onChange={handleChange} 
                      placeholder="URL to your avatar image"
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  
                  {profile.bio && (
                    <p className="mt-2">{profile.bio}</p>
                  )}
                  
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline mt-1 block"
                    >
                      {profile.website}
                    </a>
                  )}
                  
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <p className="font-semibold">{profile.contributions || 0}</p>
                      <p className="text-sm text-muted-foreground">Contributions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{profile.followers || 0}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{profile.following || 0}</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>
                  
                  {profile.role && (
                    <div className="mt-4">
                      <Badge variant={profile.role === "admin" ? "default" : "outline"}>{profile.role}</Badge>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Profile Tabs */}
      <Tabs defaultValue="activity">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Contributions</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-6">
          <ProfileActivity userId={profile.id} />
        </TabsContent>
        
        <TabsContent value="contributions" className="space-y-6">
          <ProfileContributions userId={profile.id} />
        </TabsContent>
        
        <TabsContent value="discussions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discussions</CardTitle>
              <CardDescription>Forum topics and replies by {profile.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                No discussions yet.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="badges" className="space-y-6">
          <ProfileBadges userId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
