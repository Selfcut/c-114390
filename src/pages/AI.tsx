
import React, { useState } from "react";
import { PageLayout } from "../components/layouts/PageLayout";
import { TabNav } from "../components/TabNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIChat from "@/components/ai/AIChat";
import { AIContentGenerator } from "@/components/ai/AIContentGenerator";
import { AISmartSearch } from "@/components/ai/AISmartSearch";
import { AIRecommendations } from "@/components/ai/AIRecommendations";
import { Bot, FileText, Search, Lightbulb } from "lucide-react";

const AI = () => {
  // Tabs for AI features
  const aiTabs = [
    {
      id: "chat",
      label: "AI Chat",
      icon: <Bot size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <AIChat />
        </div>
      )
    },
    {
      id: "content",
      label: "Content Generator",
      icon: <FileText size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <AIContentGenerator />
        </div>
      )
    },
    {
      id: "search",
      label: "Smart Search",
      icon: <Search size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <AISmartSearch />
        </div>
      )
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: <Lightbulb size={16} className="mr-1" />,
      content: (
        <div className="space-y-6">
          <AIRecommendations />
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <main className="py-8 px-6 md:px-12">
        <div className="flex items-center gap-2 mb-8">
          <Bot size={24} className="text-primary" />
          <h1 className="text-3xl font-bold">AI Features</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Powered by Artificial Intelligence</CardTitle>
            <CardDescription>
              Explore our AI-powered features to enhance your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our AI tools leverage the latest in machine learning technology to help you generate content,
              find information, get personalized recommendations, and chat with our intelligent assistant.
            </p>
          </CardContent>
        </Card>
        
        <TabNav tabs={aiTabs} defaultTab="chat" />
      </main>
    </PageLayout>
  );
};

export default AI;
