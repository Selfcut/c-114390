
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useTheme } from '@/lib/theme-context';

export const StylesDebugger = () => {
  const { theme } = useTheme();
  const [styleStatus, setStyleStatus] = useState<{[key: string]: boolean | string}>({
    tailwind: false,
    button: false,
    colors: false,
    fonts: false,
    cssVariables: false,
    layout: false,
    primaryColor: 'unknown',
    secondaryColor: 'unknown',
    sidebarColor: 'unknown',
    currentTheme: 'unknown'
  });
  
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    // Check if Tailwind is working by testing a simple class
    const testDiv = document.createElement('div');
    testDiv.className = 'bg-blue-500';
    document.body.appendChild(testDiv);
    const tailwindWorking = window.getComputedStyle(testDiv).backgroundColor !== '';
    document.body.removeChild(testDiv);

    // Check if shadcn button styles are working
    const buttonTest = document.querySelector('[data-test="button-test"]');
    const buttonStylesWorking = buttonTest ? 
      window.getComputedStyle(buttonTest).backgroundColor !== 'rgba(0, 0, 0, 0)' : 
      false;

    // Check if custom colors are working
    const colorTest = document.querySelector('[data-test="color-test"]');
    const colorsWorking = colorTest ? 
      window.getComputedStyle(colorTest).backgroundColor !== 'rgba(0, 0, 0, 0)' : 
      false;
      
    // Check if fonts are loaded
    document.fonts.ready.then(() => {
      setFontLoaded(true);
      
      // Check if Inter font is loaded
      const fontTest = document.querySelector('[data-test="font-test"]');
      const fontFamily = fontTest ? 
        window.getComputedStyle(fontTest).fontFamily : '';
      const fontWorking = fontFamily.includes('Inter') || fontFamily.includes('Arial');
      
      // Check CSS variables
      const cssVarTest = document.createElement('div');
      cssVarTest.style.backgroundColor = 'hsl(var(--primary))';
      document.body.appendChild(cssVarTest);
      const cssVarsWorking = window.getComputedStyle(cssVarTest).backgroundColor !== 'rgba(0, 0, 0, 0)';
      document.body.removeChild(cssVarTest);
      
      // Create test elements for each color
      const primaryVarTest = document.createElement('div');
      primaryVarTest.style.backgroundColor = 'hsl(var(--primary))';
      document.body.appendChild(primaryVarTest);
      const primaryColor = window.getComputedStyle(primaryVarTest).backgroundColor;
      document.body.removeChild(primaryVarTest);

      const secondaryVarTest = document.createElement('div');
      secondaryVarTest.style.backgroundColor = 'hsl(var(--secondary))';
      document.body.appendChild(secondaryVarTest);
      const secondaryColor = window.getComputedStyle(secondaryVarTest).backgroundColor;
      document.body.removeChild(secondaryVarTest);

      const sidebarVarTest = document.createElement('div');
      sidebarVarTest.style.backgroundColor = 'hsl(var(--sidebar-background))';
      document.body.appendChild(sidebarVarTest);
      const sidebarColor = window.getComputedStyle(sidebarVarTest).backgroundColor;
      document.body.removeChild(sidebarVarTest);
      
      // Check if layout is full width
      const rootElement = document.getElementById('root');
      const layoutWorking = rootElement ? rootElement.offsetWidth >= window.innerWidth - 5 : false;
      
      setStyleStatus({
        tailwind: tailwindWorking,
        button: buttonStylesWorking,
        colors: colorsWorking,
        fonts: fontWorking,
        cssVariables: cssVarsWorking,
        layout: layoutWorking,
        primaryColor,
        secondaryColor,
        sidebarColor,
        currentTheme: theme
      });
    });

    console.log('Style checks initiated:', {
      tailwindWorking,
      buttonStylesWorking,
      colorsWorking
    });
    
    // Debug specific elements
    console.log('Root element dimensions:', {
      width: document.getElementById('root')?.offsetWidth,
      windowWidth: window.innerWidth
    });
    
    // Log out computed styles of sidebar
    const sidebarEl = document.querySelector('.bg-sidebar');
    if (sidebarEl) {
      console.log('Sidebar computed styles:', {
        background: window.getComputedStyle(sidebarEl).backgroundColor,
        width: window.getComputedStyle(sidebarEl).width
      });
    }
  }, [theme]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`styles-debugger fixed bottom-4 right-4 z-50 p-4 ${isDark ? 'bg-[#1A1A1A]' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-lg max-w-sm`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={isDark ? 'text-white' : 'text-gray-800'}>Styles Debugger</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleDetails}
          className="h-7 text-xs">
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </div>
      
      {showDetails && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-red-500 h-6 w-full" data-test="color-test"></div>
            <div className="bg-blue-500 h-6 w-full"></div>
            <div className="bg-green-500 h-6 w-full"></div>
            <div className="bg-yellow-500 h-6 w-full"></div>
            <div className="bg-purple-500 h-6 w-full"></div>
            <div className="bg-orange-500 h-6 w-full"></div>
            <div className="h-6 w-full" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
            <div className="h-6 w-full" style={{ backgroundColor: 'hsl(var(--secondary))' }}></div>
            <div className="h-6 w-full" style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}></div>
          </div>
          
          <div className="mb-4">
            <p className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Text Styles:</p>
            <p className="text-sm" data-test="font-test">Normal text</p>
            <p className="text-sm font-bold">Bold text</p>
            <p className="text-sm italic">Italic text</p>
            <p className="text-sm underline">Underlined text</p>
          </div>
          
          <Button variant="default" className="w-full mb-4" data-test="button-test">
            Test Button
          </Button>
          
          <div className="space-y-1">
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Style Status:</p>
            <p className={`text-xs ${styleStatus.tailwind ? 'text-green-500' : 'text-red-500'}`}>
              Tailwind: {styleStatus.tailwind ? '✓' : '✗'}
            </p>
            <p className={`text-xs ${styleStatus.button ? 'text-green-500' : 'text-red-500'}`}>
              Button Styles: {styleStatus.button ? '✓' : '✗'}
            </p>
            <p className={`text-xs ${styleStatus.colors ? 'text-green-500' : 'text-red-500'}`}>
              Custom Colors: {styleStatus.colors ? '✓' : '✗'}
            </p>
            <p className={`text-xs ${styleStatus.fonts ? 'text-green-500' : 'text-red-500'}`}>
              Fonts: {fontLoaded ? (styleStatus.fonts ? '✓' : '✗') : '⟳'}
            </p>
            <p className={`text-xs ${styleStatus.cssVariables ? 'text-green-500' : 'text-red-500'}`}>
              CSS Variables: {styleStatus.cssVariables ? '✓' : '✗'}
            </p>
            <p className={`text-xs ${styleStatus.layout ? 'text-green-500' : 'text-red-500'}`}>
              Full Width Layout: {styleStatus.layout ? '✓' : '✗'}
            </p>
            <p className="text-xs text-blue-500">
              Current Theme: {styleStatus.currentTheme}
            </p>
          </div>
          
          <div className={`mt-4 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Color Values:</p>
            <p className="text-xs">Primary: {styleStatus.primaryColor?.toString()}</p>
            <p className="text-xs">Secondary: {styleStatus.secondaryColor?.toString()}</p>
            <p className="text-xs">Sidebar: {styleStatus.sidebarColor?.toString()}</p>
          </div>
          
          <div className={`mt-4 pt-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Layout Debug:</p>
            <p className="text-xs">Root Width: {document.getElementById('root')?.offsetWidth || 'Unknown'}</p>
            <p className="text-xs">Window Width: {window.innerWidth}</p>
          </div>
        </>
      )}
    </div>
  );
};
