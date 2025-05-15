
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { PromoBar } from "@/components/PromoBar";
import { Sidebar } from "@/components/Sidebar";
import { BookOpen, Edit, Search } from "lucide-react";

const Wiki = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-auto">
            <main className="py-8 px-8 lg:px-12">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Polymath Wiki</h1>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search wiki..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md border-border bg-background" 
                    />
                  </div>
                  <Button className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    <span>Create Entry</span>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Hermeticism</CardTitle>
                    <CardDescription>Ancient philosophical tradition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Hermeticism is an ancient philosophical and esoteric tradition based primarily upon writings attributed to Hermes Trismegistus.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 3 days ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>24 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Sacred Geometry</CardTitle>
                    <CardDescription>Mathematical patterns in nature</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sacred geometry involves geometric patterns that are used as a metaphor to understand deeper spiritual meanings and universal truths.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 1 week ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>18 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Alchemy</CardTitle>
                    <CardDescription>Transformation of matter and spirit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Alchemy is an ancient branch of natural philosophy that sought to transform base metals into gold and discover the universal elixir.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 5 days ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>31 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Gnosticism</CardTitle>
                    <CardDescription>Ancient religious ideas and systems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gnosticism refers to a collection of religious ideas and systems that originated in the 1st century CE among Jewish and early Christian sects.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 2 weeks ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>15 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Kabbalah</CardTitle>
                    <CardDescription>Esoteric method and school of thought</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Kabbalah is an esoteric method, discipline, and school of thought in Jewish mysticism that emerged in 12th century Spain.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 4 days ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>27 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="enhanced-card">
                  <CardHeader>
                    <CardTitle>Astrology</CardTitle>
                    <CardDescription>Study of celestial influences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Astrology is a system that proposes connections between astronomical phenomena and events or descriptions of personality in the human world.
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Last updated: 1 day ago</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>36 contributors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
