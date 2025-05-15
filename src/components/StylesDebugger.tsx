
import React from 'react';
import { Button } from './ui/button';

export const StylesDebugger = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-[#1A1A1A] rounded-lg border border-gray-800 shadow-lg">
      <h2 className="text-white font-bold mb-2">Styles Debugger</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-red-500 h-6 w-full"></div>
        <div className="bg-blue-500 h-6 w-full"></div>
        <div className="bg-green-500 h-6 w-full"></div>
        <div className="bg-yellow-500 h-6 w-full"></div>
      </div>
      <Button variant="default" className="w-full">
        Test Button
      </Button>
      <p className="mt-2 text-xs text-gray-400">
        If you see colored boxes and styled button, Tailwind is working.
      </p>
    </div>
  );
};
