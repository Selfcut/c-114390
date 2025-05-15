import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserHoverCard } from "./UserHoverCard";
import { Calendar, MapPin, Link as LinkIcon, MessageSquare, Users, Award, BookOpen, Brain, Lightbulb, Zap } from "lucide-react";

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedDate?: string;
    isOnline?: boolean;
    stats: {
      discussions: number;
      contributions: number;
      karma: number;
      followers: number;
      following: number;
      studyGroups: number;
    };
    badges: Array<{id: string, name: string, icon: string, color?: string}>;
    intellect: {
      iq?: number;
      disciplines: Array<{name: string, score: number, level: string}>;
      strengths: Array<{name: string, value: number}>;
    };
    connections: Array<{
      id: string;
      username: string;
      displayName: string;
      avatarUrl?: string;
      isOnline?: boolean;
    }>;
  };
  isCurrentUser?: boolean;
}

export function UserProfile({ user, isCurrentUser = false }: UserProfileProps) {
  const coverStyle = user.coverImageUrl 
    ? { backgroundImage: `url(${user.coverImageUrl})` }
    : { backgroundColor: '#6E59A5' };

  const renderIcon = (iconName: string) => {
    const icons: {[key: string]: React.ReactNode} = {
      'award': <Award className="h-4 w-4" />,
      'book': <BookOpen className="h-4 w-4" />,
      'brain': <Brain className="h-4 w-4" />,
      'lightbulb': <Lightbulb className="h-4 w-4" />,
      'zap': <Zap className="h-4 w-4" />
    };
    return icons[iconName] || <Award className="h-4 w-4" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div 
        className="h-48 w-full rounded-t-lg bg-cover bg-center relative" 
        style={coverStyle}
      >
        {isCurrentUser && (
          <Button
            size="sm"
            variant="outline"
            className="absolute right-4 bottom-4 bg-background/80 backdrop-blur-sm"
          >
            Change Cover
          </Button>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative px-6 pb-6 bg-card rounded-b-lg border border-border">
        <div className="flex flex-col sm:flex-row gap-4 -mt-12 sm:-mt-16">
          <div className="relative">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-2xl">{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background" />
            )}
            {isCurrentUser && (
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span className="sr-only">Edit Profile</span>
              </Button>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {user.displayName}
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
                {user.intellect.iq ? `IQ ${user.intellect.iq}` : 'Scholar'}
              </Badge>
            </h1>
            <p className="text-muted-foreground">@{user.username}</p>

            <div className="mt-4 flex flex-wrap gap-4">
              {user.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <LinkIcon className="h-4 w-4" />
                  <a href={user.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{user.joinedDate || 'Joined recently'}</span>
              </div>
            </div>
          </div>

          <div className="ml-auto flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:self-start">
            {!isCurrentUser && (
              <>
                <Button variant="outline">
                  <Users className="mr-1 h-4 w-4" />
                  Follow
                </Button>
                <Button className="bg-[#6E59A5] hover:bg-[#7E69B5]">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Message
                </Button>
              </>
            )}
            {isCurrentUser && (
              <Button variant="outline">Edit Profile</Button>
            )}
          </div>
        </div>

        {/* Profile Bio */}
        <div className="mt-6">
          <p className="text-sm">{user.bio || 'No bio yet.'}</p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-between mt-8 gap-2">
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.discussions}</div>
            <div className="text-xs text-muted-foreground">Discussions</div>
          </div>
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.karma}</div>
            <div className="text-xs text-muted-foreground">Karma</div>
          </div>
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.contributions}</div>
            <div className="text-xs text-muted-foreground">Contributions</div>
          </div>
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.followers}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.following}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
          <div className="text-center px-3">
            <div className="font-semibold">{user.stats.studyGroups}</div>
            <div className="text-xs text-muted-foreground">Study Groups</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">Badges & Achievements</h2>
        <div className="flex flex-wrap gap-2">
          {user.badges.map(badge => (
            <Badge 
              key={badge.id} 
              variant="outline" 
              className={`text-sm py-1.5 px-3 ${badge.color || 'bg-primary/10 text-primary border-primary/20'}`}
            >
              {renderIcon(badge.icon)}
              <span className="ml-1">{badge.name}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="intellect" className="mt-8">
        <TabsList className="w-full">
          <TabsTrigger value="intellect" className="flex-1">Intellect</TabsTrigger>
          <TabsTrigger value="contributions" className="flex-1">Contributions</TabsTrigger>
          <TabsTrigger value="network" className="flex-1">Network</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="intellect" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {user.intellect.disciplines.map((discipline, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{discipline.name}</span>
                    <span className="text-sm text-muted-foreground">{discipline.level}</span>
                  </div>
                  <Progress value={discipline.score} className="h-2" />
                </div>
              ))}
              
              <h3 className="font-medium mt-6 mb-4">Cognitive Strengths</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.intellect.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{strength.name}</span>
                        <span className="text-xs text-muted-foreground">{strength.value}/10</span>
                      </div>
                      <Progress value={strength.value * 10} className="h-1 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="network" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Connections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.connections.map((connection) => (
                  <div key={connection.id} className="flex items-center gap-3 p-3 rounded-md border">
                    <UserHoverCard
                      username={connection.username}
                      displayName={connection.displayName}
                      avatar={connection.avatarUrl}
                      isOnline={connection.isOnline}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={connection.avatarUrl} />
                        <AvatarFallback>{connection.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </UserHoverCard>
                    <div>
                      <div className="font-medium text-sm">{connection.displayName}</div>
                      <div className="text-xs text-muted-foreground">@{connection.username}</div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contributions" className="mt-4">
          <EmptyState 
            type="library"
            title="No contributions yet"
            description="When you contribute to discussions, resources, or the library, they'll appear here."
          />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-4">
          <EmptyState 
            type="events"
            title="No recent activity"
            description="Your recent actions and interactions will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Importing EmptyState from the EmptyStates component to avoid circular dependency
function EmptyState({
  type,
  title,
  description
}: {
  type: 'messages' | 'notifications' | 'discussions' | 'library' | 'search' | 'events';
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        {/* Simple placeholder instead of full SVG since we have those defined elsewhere */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          {type === 'library' && <BookOpen className="h-12 w-12 text-primary/40" />}
          {type === 'events' && <Calendar className="h-12 w-12 text-primary/40" />}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
    </div>
  );
}
