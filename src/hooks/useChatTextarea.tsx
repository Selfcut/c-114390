
import { useRef, useEffect, useState } from 'react';

interface UseChatTextareaProps {
  message: string;
  isEditing?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

export const useChatTextarea = ({
  message,
  isEditing = false,
  minHeight = 40,
  maxHeight = 120
}: UseChatTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(minHeight);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate scroll height
    textarea.style.height = `${minHeight}px`;
    
    // Calculate new height based on content
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    setTextareaHeight(newHeight);
    textarea.style.height = `${newHeight}px`;
  }, [message, minHeight, maxHeight]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  return {
    textareaRef,
    textareaHeight
  };
};
