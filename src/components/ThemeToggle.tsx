
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useToast } from "@/hooks/use-toast";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: `You've switched to ${newTheme} mode.`,
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-9 h-9"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun
          className="h-[1.2rem] w-[1.2rem] transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
          aria-hidden="true"
        />
        <Moon
          className="absolute h-[1.2rem] w-[1.2rem] transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100"
          aria-hidden="true"
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
