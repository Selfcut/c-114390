
import React from 'react';

// Function to parse and render message content with markdown, mentions and GIFs
export function parseMarkdown(content: string): JSX.Element | string {
  if (!content) return "";

  // Very simple markdown parsing
  let formattedContent = content;

  // 1. Handle bold text: **bold** -> <strong>bold</strong>
  formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 2. Handle italic text: *italic* -> <em>italic</em>
  formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 3. Handle mentions: @username -> <span class="mention">@username</span>
  formattedContent = formattedContent.replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>');
  
  // 4. Handle inline code: `code` -> <code>code</code>
  formattedContent = formattedContent.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>');
  
  // 5. Handle image embeds: ![alt](url) -> <img src="url" alt="alt" />
  formattedContent = formattedContent.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-h-48 rounded-md my-2" />');
  
  // 6. Handle links: [text](url) -> <a href="url">text</a>
  formattedContent = formattedContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  
  // 7. Handle line breaks: \n -> <br />
  formattedContent = formattedContent.replace(/\n/g, '<br />');
  
  // Return as HTML
  return <div dangerouslySetInnerHTML={{ __html: formattedContent }} />;
}

// Function to detect and extract mentions from a message content
export function extractMentions(content: string): string[] {
  const matches = content.match(/@(\w+)/g);
  return matches ? matches.map(m => m.substring(1)) : [];
}
