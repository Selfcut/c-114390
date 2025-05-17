
import { useState } from "react";

interface UseChatInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  message: string;
  setMessage: (message: string) => void;
}

export const useChatInput = ({ 
  textareaRef, 
  message, 
  setMessage
}: UseChatInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || message.length;
    const newMessage = message.substring(0, cursorPosition) + emoji + message.substring(cursorPosition);
    setMessage(newMessage);
    setShowEmojiPicker(false);
    
    // Focus back on textarea and set cursor position after the inserted emoji
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = cursorPosition + emoji.length;
        textareaRef.current.selectionEnd = cursorPosition + emoji.length;
      }
    }, 0);
  };

  const handleGifSelect = (gif: { url: string; alt: string }) => {
    // Insert markdown image format for GIF
    const gifMarkdown = `![${gif.alt}](${gif.url})`;
    const cursorPosition = textareaRef.current?.selectionStart || message.length;
    const newMessage = message.substring(0, cursorPosition) + " " + gifMarkdown + message.substring(cursorPosition);
    setMessage(newMessage);
    setShowGifPicker(false);
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleMentionUser = (username: string) => {
    const currentPosition = textareaRef.current?.selectionStart || message.length;
    const beforeCursor = message.substring(0, currentPosition);
    const afterCursor = message.substring(currentPosition);
    
    // Check if we need to add a space before the mention
    const needsSpace = beforeCursor.length > 0 && !beforeCursor.endsWith(' ');
    
    // Create the new message string directly
    const newMessage = `${beforeCursor}${needsSpace ? ' ' : ''}@${username} ${afterCursor}`;
    setMessage(newMessage);
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = currentPosition + (needsSpace ? 2 : 1) + username.length + 1;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
      }
    }, 0);
  };
  
  const handleFileUpload = () => {
    // In a real implementation, this would open a file picker
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*,audio/*,application/pdf';
    fileInput.style.display = 'none';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Here you would handle uploading to storage
        const updatedMessage = message + " [File uploaded: " + files[0].name + "]";
        setMessage(updatedMessage);
      }
    };
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };
  
  return {
    showEmojiPicker,
    setShowEmojiPicker,
    showGifPicker,
    setShowGifPicker,
    handleEmojiSelect,
    handleGifSelect,
    handleMentionUser,
    handleFileUpload
  };
};
