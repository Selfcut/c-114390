
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

export const StylesDebugger = () => {
  const [styleStatus, setStyleStatus] = useState<{[key: string]: boolean}>({
    tailwind: false,
    button: false,
    colors: false,
    fonts: false,
    cssVariables: false
  });
  
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
      
      // Check if CSS variables are working
      const cssVarTest = document.createElement('div');
      cssVarTest.style.backgroundColor = 'hsl(var(--primary))';
      document.body.appendChild(cssVarTest);
      const cssVarsWorking = window.getComputedStyle(cssVarTest).backgroundColor !== 'rgba(0, 0, 0, 0)';
      document.body.removeChild(cssVarTest);
      
      setStyleStatus({
        tailwind: tailwindWorking,
        button: buttonStylesWorking,
        colors: colorsWorking,
        fonts: fontWorking,
        cssVariables: cssVarsWorking
      });
    });

    console.log('Style checks initiated:', {
      tailwindWorking,
      buttonStylesWorking,
      colorsWorking
    });
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-[#1A1A1A] rounded-lg border border-gray-800 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-bold">Styles Debugger</h2>
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
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-sm mb-1">Text Styles:</p>
            <p className="text-sm" data-test="font-test">Normal text</p>
            <p className="text-sm font-bold">Bold text</p>
            <p className="text-sm italic">Italic text</p>
            <p className="text-sm underline">Underlined text</p>
          </div>
          
          <Button variant="default" className="w-full mb-4" data-test="button-test">
            Test Button
          </Button>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Style Status:</p>
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
          </div>
        </>
      )}
    </div>
  );
};
