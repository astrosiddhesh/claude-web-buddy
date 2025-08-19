import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Terminal from '@/components/terminal/Terminal';
import { 
  Terminal as TerminalIcon,
  Code2,
  Github,
  Settings,
  HelpCircle
} from 'lucide-react';

const Index = () => {
  const [activeTerminal, setActiveTerminal] = useState('claude');

  return (
    <div className="min-h-screen bg-editor-background">
      {/* Header */}
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded bg-primary/20">
                <TerminalIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  Claude Web Buddy
                </h1>
                <p className="text-xs text-muted-foreground">
                  Terminal-based AI Code Assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Terminal Tabs */}
      <div className="container mx-auto px-4 pt-2">
        <Tabs value={activeTerminal} onValueChange={setActiveTerminal} className="h-[calc(100vh-100px)]">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/20 border border-border">
            <TabsTrigger value="claude" className="gap-2 text-xs">
              <Code2 className="w-3 h-3" />
              Claude Code CLI
            </TabsTrigger>
            <TabsTrigger value="codex" className="gap-2 text-xs">
              <TerminalIcon className="w-3 h-3" />
              OpenAI Codex CLI
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="claude" className="h-full mt-2">
            <div className="h-full border border-border rounded-lg overflow-hidden bg-editor-background">
              <Terminal 
                title="Claude Code"
                initialLines={[]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="codex" className="h-full mt-2">
            <div className="h-full border border-border rounded-lg overflow-hidden bg-editor-background">
              <Terminal 
                title="OpenAI Codex CLI"
                initialLines={[]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;