import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onCodeGenerated?: (code: string, language: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCodeGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you write, review, debug, and explain code in any programming language. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want help with: "${inputMessage}". Here's how I can assist you with that code task...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-surface border border-border rounded-lg shadow-medium overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Code Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by {selectedModel}</p>
          </div>
        </div>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-48 bg-muted/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
            <SelectItem value="claude-opus-4">Claude Opus 4</SelectItem>
            <SelectItem value="gpt-5">GPT-5</SelectItem>
            <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
            <SelectItem value="o4-mini">O4 Mini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <Card className={`max-w-[80%] p-4 ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-card border-border'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </Card>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="bg-card border-border p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to write, review, or explain code..."
            className="flex-1 min-h-[40px] max-h-32 resize-none bg-background border-border"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            variant="hero"
            size="icon"
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;