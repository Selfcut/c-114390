
import React, { useEffect } from 'react';
import { ChatMessage } from './types';

interface AutomatedMessagesProps {
  addMessage: (message: ChatMessage) => void;
}

export const AutomatedMessages: React.FC<AutomatedMessagesProps> = ({ addMessage }) => {
  useEffect(() => {
    // Introduction message
    const introMessage: ChatMessage = {
      id: 'intro-1',
      content: 'Welcome to our community chat! Feel free to ask questions and connect with others.',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Tips message
    const tipsMessage: ChatMessage = {
      id: 'tips-1',
      content: 'Tip: You can use reactions to express how you feel about a message.',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Events reminder
    const eventsMessage: ChatMessage = {
      id: 'events-1',
      content: 'Don\'t forget to check out upcoming events in the Events section!',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Tips for new users
    const newUserMessage: ChatMessage = {
      id: 'newuser-1',
      content: 'New here? Be sure to complete your profile and introduce yourself to the community!',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Help message
    const helpMessage: ChatMessage = {
      id: 'help-1',
      content: 'Need help? Type @admin followed by your question to get assistance from our team.',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Research insight
    const researchMessage: ChatMessage = {
      id: 'research-1',
      content: 'Check out our Research section for the latest papers and publications in our field.',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Quote of the day
    const quoteMessage: ChatMessage = {
      id: 'quote-1',
      content: 'Quote of the day: "The greatest glory in living lies not in never falling, but in rising every time we fall." - Nelson Mandela',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Community guidelines reminder
    const guidelinesMessage: ChatMessage = {
      id: 'guidelines-1',
      content: 'Remember our community guidelines: Be respectful, stay on topic, and help others when you can!',
      createdAt: new Date().toISOString(),
      userId: 'system',
      conversationId: 'global',
      senderName: 'System',
      isCurrentUser: false,
      isSystem: true,
      reactions: []
    };
    
    // Send messages at intervals
    const messages = [
      introMessage,
      tipsMessage,
      eventsMessage,
      newUserMessage,
      helpMessage,
      researchMessage,
      quoteMessage,
      guidelinesMessage
    ];
    
    let index = 0;
    const sendInterval = setInterval(() => {
      if (index < messages.length) {
        addMessage(messages[index]);
        index++;
      } else {
        clearInterval(sendInterval);
      }
    }, 30000); // Send a message every 30 seconds
    
    // Send first message immediately
    addMessage(messages[0]);
    index++;
    
    return () => clearInterval(sendInterval);
  }, [addMessage]);
  
  return null;
};
