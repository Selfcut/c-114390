
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  Flag, 
  MessageSquare, 
  Shield,
  CheckCircle,
  XCircle,
  User,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AdminReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Moderation</h1>
          <p className="text-muted-foreground">
            Review and manage reported content and users
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>Pending Reports</span>
            <Badge className="ml-1 bg-red-500/80 text-white">12</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>Resolved</span>
          </TabsTrigger>
          <TabsTrigger value="dismissed" className="flex items-center gap-2">
            <XCircle size={16} />
            <span>Dismissed</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Flag size={16} />
            <span>All Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>
                Content and users reported by the community that need review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Report Item 1 */}
                <div className="border border-border rounded-md p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/10 p-2 rounded-full">
                      <MessageSquare size={24} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 mb-2">
                            Harmful Content
                          </Badge>
                          <h3 className="font-medium text-base">Forum Comment Reported</h3>
                        </div>
                        <Badge>3 reports</Badge>
                      </div>
                      
                      <div className="mt-2 bg-muted p-3 rounded-md text-sm">
                        <p className="text-muted-foreground">Reported Content:</p>
                        <p className="mt-1">"This content contains misleading information about scientific facts..."</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <span>Posted by </span>
                            <span className="font-medium">John Doe</span>
                          </div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Content</Button>
                          <Button variant="outline" size="sm">Dismiss</Button>
                          <Button variant="destructive" size="sm">Take Action</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Report Item 2 */}
                <div className="border border-border rounded-md p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-500/10 p-2 rounded-full">
                      <User size={24} className="text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 mb-2">
                            User Behavior
                          </Badge>
                          <h3 className="font-medium text-base">User Reported for Harassment</h3>
                        </div>
                        <Badge>2 reports</Badge>
                      </div>
                      
                      <div className="mt-2 bg-muted p-3 rounded-md text-sm">
                        <p className="text-muted-foreground">Report Reason:</p>
                        <p className="mt-1">"This user has been sending harassing private messages to multiple members..."</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Problem" />
                            <AvatarFallback>PU</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <span>Reported user: </span>
                            <span className="font-medium">ProblemUser123</span>
                          </div>
                          <div className="text-xs text-muted-foreground">5 hours ago</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button variant="outline" size="sm">View Messages</Button>
                          <Button variant="destructive" size="sm">Take Action</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Report Item 3 */}
                <div className="border border-border rounded-md p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Shield size={24} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-2">
                            Copyright
                          </Badge>
                          <h3 className="font-medium text-base">Library Content Reported</h3>
                        </div>
                        <Badge>1 report</Badge>
                      </div>
                      
                      <div className="mt-2 bg-muted p-3 rounded-md text-sm">
                        <p className="text-muted-foreground">Report Reason:</p>
                        <p className="mt-1">"This uploaded content appears to be copyrighted material from..."</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            <span>Content: </span>
                            <span className="font-medium">"Introduction to Quantum Physics"</span>
                          </div>
                          <div className="text-xs text-muted-foreground">1 day ago</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Content</Button>
                          <Button variant="outline" size="sm">Dismiss</Button>
                          <Button variant="destructive" size="sm">Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing 3 of 12 pending reports
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Reports</CardTitle>
              <CardDescription>Reports that have been reviewed and resolved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Resolved reports content
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dismissed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dismissed Reports</CardTitle>
              <CardDescription>Reports that were reviewed and dismissed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                Dismissed reports content
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Complete history of all reported content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                All reports content
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Activity</CardTitle>
          <CardDescription>Recent actions taken by moderators</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-medium text-muted-foreground p-2">Action</th>
                <th className="text-left font-medium text-muted-foreground p-2">Moderator</th>
                <th className="text-left font-medium text-muted-foreground p-2">Date</th>
                <th className="text-left font-medium text-muted-foreground p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-2">Content Removed</td>
                <td className="p-2">Alice Smith</td>
                <td className="p-2">Today, 10:25 AM</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Details</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">User Warned</td>
                <td className="p-2">Bob Johnson</td>
                <td className="p-2">Yesterday, 3:42 PM</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Details</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">User Suspended</td>
                <td className="p-2">Alice Smith</td>
                <td className="p-2">Yesterday, 11:30 AM</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Details</Button>
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-2">Report Dismissed</td>
                <td className="p-2">Charlie Brown</td>
                <td className="p-2">2 days ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Details</Button>
                </td>
              </tr>
              <tr>
                <td className="p-2">Comment Edited</td>
                <td className="p-2">Diana Prince</td>
                <td className="p-2">3 days ago</td>
                <td className="p-2">
                  <Button variant="ghost" size="sm">Details</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
