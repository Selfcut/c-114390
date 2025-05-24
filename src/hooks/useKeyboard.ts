
import { useEffect } from 'react';

interface UseKeyboardOptions {
  key: string;
  callback: () => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboard = ({ 
  key, 
  callback, 
  enabled = true, 
  preventDefault = true 
}: UseKeyboardOptions) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === key) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [key, callback, enabled, preventDefault]);
};

export const useEscapeKey = (callback: () => void, enabled = true) => {
  useKeyboard({ key: 'Escape', callback, enabled });
};

export const useEnterKey = (callback: () => void, enabled = true) => {
  useKeyboard({ key: 'Enter', callback, enabled });
};
