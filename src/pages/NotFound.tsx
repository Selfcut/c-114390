
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layouts/PageLayout";

const NotFound = () => {
  return (
    <PageLayout showSidebar={false} showPromo={false} showHeader={false}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Search size={48} className="text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-background flex items-center justify-center text-2xl font-bold">
                ?
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link to="/" className="flex items-center">
                <Home size={16} className="mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="#" onClick={() => window.history.back()} className="flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
