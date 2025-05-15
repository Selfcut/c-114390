
import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved preference in localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return "light";
      }
    }
    
    // Default to dark mode
    return "dark";
  });

  useEffect(() => {
    // Apply theme changes immediately when component mounts and when theme changes
    applyTheme(theme);
    
    // Save theme preference
    localStorage.setItem("theme", theme);
    
    console.log(`Theme set to: ${theme}`);
  }, [theme]);

  const applyTheme = (currentTheme: Theme) => {
    const root = document.documentElement;
    
    if (currentTheme === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    }
    
    // Force color updates on all relevant elements
    document.body.style.backgroundColor = currentTheme === "light" ? "#ffffff" : "#121212";
    document.body.style.color = currentTheme === "light" ? "#1a202c" : "#ffffff";
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "dark" ? "light" : "dark";
      console.log(`Toggling theme from ${prev} to ${newTheme}`);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
