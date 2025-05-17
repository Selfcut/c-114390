
import { useRef, useEffect, useState } from "react";

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
  
  // Function to adjust height based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height temporarily to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate the new height
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    // Set the new height
    textarea.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  };
  
  // Adjust height whenever message changes
  useEffect(() => {
    adjustHeight();
  }, [message]);
  
  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      
      // Place cursor at the end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);
  
  return {
    textareaRef,
    textareaHeight,
    adjustHeight
  };
};
