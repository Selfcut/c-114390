
import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const handleToggle = () => {
    toggleTheme();
    
    toast({
      title: `${theme === "dark" ? "Light" : "Dark"} mode activated`,
      description: `Switched to ${theme === "dark" ? "light" : "dark"} mode`,
      duration: 2000,
    });
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-9 h-9 p-0 rounded-full"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-700" />
      )}
    </Button>
  );
};
