import React from 'react';
import { Button } from '@/components/ui/button';
import Terminal from '@/components/terminal/Terminal';
import { 
  Terminal as TerminalIcon,
  Github,
  Settings,
  HelpCircle,
  Maximize2
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-editor-background">
      {/* Minimal Header */}
      <header className="border-b border-border bg-card/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded bg-primary/20 animate-glow-pulse">
                <TerminalIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Claude Web Buddy
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Terminal Assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8 hover-scale">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover-scale">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover-scale">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 hover-scale">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Full Terminal */}
      <div className="container mx-auto px-4 pt-2 pb-2">
        <div className="h-[calc(100vh-100px)] border border-border rounded-lg overflow-hidden bg-editor-background shadow-large animate-fade-in">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Index;