
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Video, FileText, Image, Youtube } from 'lucide-react';

interface MediaFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const MediaFilters = ({ filterType, setFilterType, sortBy, setSortBy }: MediaFiltersProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search for:', searchTerm);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Type Filters */}
          <Tabs defaultValue={filterType} onValueChange={setFilterType} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-1">
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-1">
                <Image className="h-4 w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-1">
                <Youtube className="h-4 w-4" />
                <span>YouTube</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Reset filters</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
