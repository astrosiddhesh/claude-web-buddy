import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ChatInterface from '@/components/chat/ChatInterface';
import CodeEditor from '@/components/editor/CodeEditor';
import FileManager from '@/components/files/FileManager';
import { 
  Terminal, 
  Code2, 
  MessageSquare, 
  FolderOpen, 
  Sparkles, 
  Github,
  Settings,
  HelpCircle
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-hero shadow-glow">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Claude Web Buddy
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Code Assistant
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-border shadow-large overflow-hidden">
          {/* Left Panel - Chat & Files */}
          <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-full bg-gradient-surface">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-2 bg-muted/50">
                  <TabsTrigger value="chat" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="files" className="gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Files
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 m-2 mt-0">
                  <ChatInterface />
                </TabsContent>
                
                <TabsContent value="files" className="flex-1 m-2 mt-0">
                  <FileManager />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-border/80 transition-colors" />

          {/* Right Panel - Code Editor */}
          <ResizablePanel defaultSize={65} minSize={50}>
            <div className="h-full p-2 bg-gradient-surface">
              <CodeEditor />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2024 Claude Web Buddy</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>Ready</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;