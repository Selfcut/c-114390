
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

export const StylesDebugger = () => {
  const [styleStatus, setStyleStatus] = useState<{[key: string]: boolean}>({
    tailwind: false,
    button: false,
    colors: false
  });

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

    setStyleStatus({
      tailwind: tailwindWorking,
      button: buttonStylesWorking,
      colors: colorsWorking
    });

    console.log('Style checks:', {
      tailwindWorking,
      buttonStylesWorking,
      colorsWorking
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-[#1A1A1A] rounded-lg border border-gray-800 shadow-lg">
      <h2 className="text-white font-bold mb-2">Styles Debugger</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-red-500 h-6 w-full" data-test="color-test"></div>
        <div className="bg-blue-500 h-6 w-full"></div>
        <div className="bg-green-500 h-6 w-full"></div>
        <div className="bg-yellow-500 h-6 w-full"></div>
      </div>
      <Button variant="default" className="w-full" data-test="button-test">
        Test Button
      </Button>
      <div className="mt-2 space-y-1">
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
      </div>
    </div>
  );
};
