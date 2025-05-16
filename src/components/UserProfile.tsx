
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, BookOpen, MessageSquare, Trophy, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UserProfile = ({ profile, isCurrentUser, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatar_url: profile.avatar_url || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate avatar fallback from name
  const getAvatarFallback = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-32 w-32 border-4 border-background shadow-md">
          <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} />
          <AvatarFallback className="text-4xl">{getAvatarFallback(profile.name)}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            {profile.bio && <p className="mt-2">{profile.bio}</p>}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {isCurrentUser && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
            
            <div className="flex gap-3 text-muted-foreground text-sm">
              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="contributions">
        <TabsList className="mb-6">
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Contributions</span>
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Discussions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy size={16} />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contributions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Knowledge Entries</CardTitle>
                <CardDescription>Articles and resources contributed</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>No entries found</p>
                <Button variant="outline" className="mt-4">Create Entry</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="discussions">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
                <CardDescription>Topics and replies</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No discussions found</p>
                <Button variant="outline" className="mt-4">Start Discussion</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>Recent actions and contributions</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <div className="space-y-6">
            <h3 className="text-xl font-medium mb-4">Badges & Achievements</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="p-2 border-2 border-primary/20">
                <Trophy size={16} className="mr-2 text-primary" />
                <span>New Member</span>
              </Badge>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave empty for a default avatar
              </p>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
