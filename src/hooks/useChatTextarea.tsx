
import { useRef, useState, useEffect } from "react";

interface UseChatTextareaProps {
  message: string;
  isEditing?: boolean;
}

export const useChatTextarea = ({ message, isEditing }: UseChatTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textareaHeight, setTextareaHeight] = useState<number>(40);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      setTextareaHeight(scrollHeight < 40 ? 40 : Math.min(scrollHeight, 120));
      textareaRef.current.style.height = `${textareaHeight}px`;
    }
  }, [message, textareaHeight]);

  return {
    textareaRef,
    textareaHeight
  };
};
