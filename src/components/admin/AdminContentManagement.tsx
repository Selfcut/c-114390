
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, LineChart, PieChart } from "@/components/charts";
import { Search, Filter, Plus, Book, MessageSquare, Tag } from "lucide-react";

export const AdminContentManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage all content across the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Forum Management
            </CardTitle>
            <CardDescription>Manage discussion topics and replies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Topics</span>
                <span className="text-muted-foreground">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Replies</span>
                <span className="text-muted-foreground">8,932</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Flagged Content</span>
                <span className="text-muted-foreground">18</span>
              </div>
              <Button className="mt-4 w-full" variant="outline">Manage Forum</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Library Management
            </CardTitle>
            <CardDescription>Manage knowledge entries and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Entries</span>
                <span className="text-muted-foreground">543</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Categories</span>
                <span className="text-muted-foreground">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pending Review</span>
                <span className="text-muted-foreground">7</span>
              </div>
              <Button className="mt-4 w-full" variant="outline">Manage Library</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Taxonomy Management
            </CardTitle>
            <CardDescription>Manage tags, categories, and topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tags</span>
                <span className="text-muted-foreground">867</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Categories</span>
                <span className="text-muted-foreground">48</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Unused Tags</span>
                <span className="text-muted-foreground">124</span>
              </div>
              <Button className="mt-4 w-full" variant="outline">Manage Taxonomy</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Overview of content across different categories</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart placeholder (Content Distribution)
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Content</CardTitle>
            <CardDescription>Recently added or updated content</CardDescription>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-medium text-muted-foreground p-2">Title</th>
                  <th className="text-left font-medium text-muted-foreground p-2">Type</th>
                  <th className="text-left font-medium text-muted-foreground p-2">Author</th>
                  <th className="text-left font-medium text-muted-foreground p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2">The Future of AI Ethics</td>
                  <td className="p-2">Forum Topic</td>
                  <td className="p-2">Alice Smith</td>
                  <td className="p-2">Today</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Introduction to Quantum Computing</td>
                  <td className="p-2">Library Entry</td>
                  <td className="p-2">Bob Johnson</td>
                  <td className="p-2">Yesterday</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Philosophy of Mathematics</td>
                  <td className="p-2">Library Entry</td>
                  <td className="p-2">Charlie Brown</td>
                  <td className="p-2">2 days ago</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2">Consciousness and Brain States</td>
                  <td className="p-2">Forum Topic</td>
                  <td className="p-2">Diana Prince</td>
                  <td className="p-2">3 days ago</td>
                </tr>
                <tr>
                  <td className="p-2">Systems Thinking Overview</td>
                  <td className="p-2">Library Entry</td>
                  <td className="p-2">Ethan Hunt</td>
                  <td className="p-2">4 days ago</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>Content flagged for review</CardDescription>
          </CardHeader>
          <CardContent className="max-h-96 overflow-auto">
            <div className="space-y-4">
              <div className="border border-border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Inappropriate Comment</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Flagged by: 3 users
                    </p>
                    <p className="mt-2 text-sm">
                      "This comment contains potentially offensive content..."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ignore</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Spam Content</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Flagged by: System
                    </p>
                    <p className="mt-2 text-sm">
                      "This post contains multiple links to commercial websites..."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ignore</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="border border-border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Copyright Concern</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Flagged by: Content Owner
                    </p>
                    <p className="mt-2 text-sm">
                      "This library entry contains copyrighted material without attribution..."
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Ignore</Button>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
