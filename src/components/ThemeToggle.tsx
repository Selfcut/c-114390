
import React from "react";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
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
    <Toggle 
      aria-label="Toggle theme"
      className="border-0 hover:bg-transparent"
      pressed={theme === "light"}
      onPressedChange={handleToggle}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-700" />
      )}
      <span className="sr-only">
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Toggle>
  );
};
