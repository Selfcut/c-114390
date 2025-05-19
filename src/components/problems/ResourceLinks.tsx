
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface ResourceLink {
  title: string;
  url: string;
}

interface ResourceLinksProps {
  resources: ResourceLink[];
}

export const ResourceLinks = ({ resources }: ResourceLinksProps) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Resources & Further Reading</CardTitle>
        <CardDescription>
          Explore these resources to learn more about this problem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li key={index} className="flex items-center">
              <ExternalLink size={16} className="mr-2 flex-shrink-0 text-primary" />
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
