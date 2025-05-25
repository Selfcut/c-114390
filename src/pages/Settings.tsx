
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Settings = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings functionality will be implemented soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
