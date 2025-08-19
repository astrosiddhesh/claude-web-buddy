import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Play, Save, FileText, Code, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
}

interface CodeEditorProps {
  initialFiles?: CodeFile[];
  onFileChange?: (file: CodeFile) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialFiles = [], onFileChange }) => {
  const [files, setFiles] = useState<CodeFile[]>(initialFiles.length > 0 ? initialFiles : [
    {
      id: '1',
      name: 'example.js',
      language: 'javascript',
      content: `// Welcome to Claude Web Buddy Code Editor
// Start coding with AI assistance!

function greetUser(name) {
  console.log(\`Hello, \${name}! Ready to code?\`);
}

greetUser('Developer');

// Try asking the AI to:
// - Generate functions
// - Review your code
// - Fix bugs
// - Add documentation
// - Convert between languages`,
      isModified: false
    }
  ]);
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || '');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleCodeChange = (content: string) => {
    if (!activeFile) return;
    
    const updatedFile = { ...activeFile, content, isModified: true };
    setFiles(prev => prev.map(f => f.id === activeFileId ? updatedFile : f));
    onFileChange?.(updatedFile);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (activeFile) {
      const updatedFile = { ...activeFile, language };
      setFiles(prev => prev.map(f => f.id === activeFileId ? updatedFile : f));
    }
  };

  const copyToClipboard = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      toast({
        title: "Code copied!",
        description: "Code has been copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded!",
      description: `${activeFile.name} has been downloaded`
    });
  };

  const createNewFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: `untitled-${files.length + 1}.js`,
      language: 'javascript',
      content: '// New file\n',
      isModified: false
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const getLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const syntaxHighlight = (content: string, language: string) => {
    // Simple syntax highlighting - in a real app, use a library like Prism.js
    return content
      .replace(/\/\/.*$/gm, '<span class="text-editor-comment">$&</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from)\b/g, '<span class="text-editor-keyword">$&</span>')
      .replace(/"([^"]*)"/g, '<span class="text-editor-string">"$1"</span>')
      .replace(/'([^']*)'/g, '<span class="text-editor-string">\'$1\'</span>')
      .replace(/\b\d+\b/g, '<span class="text-editor-number">$&</span>')
      .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-editor-function">$1</span>(');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-surface border border-border rounded-lg shadow-medium overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Code Editor</h3>
          </div>
          
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'code' | 'preview')}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="code" className="gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadFile}>
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="hero" size="sm" onClick={createNewFile}>
            <FileText className="w-4 h-4" />
            New File
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      {files.length > 1 && (
        <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/20">
          {files.map((file) => (
            <Button
              key={file.id}
              variant={activeFileId === file.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFileId(file.id)}
              className="gap-2"
            >
              {file.name}
              {file.isModified && <div className="w-2 h-2 rounded-full bg-warning"></div>}
            </Button>
          ))}
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 flex">
        {viewMode === 'code' ? (
          <div className="flex-1 flex">
            {/* Line Numbers */}
            <div className="w-12 bg-muted/30 border-r border-border p-2 font-mono text-xs text-muted-foreground">
              {activeFile && getLineNumbers(activeFile.content).map(num => (
                <div key={num} className="leading-6 text-right pr-2">
                  {num}
                </div>
              ))}
            </div>
            
            {/* Code Area */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={activeFile?.content || ''}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-full p-4 bg-editor-background text-editor-foreground font-mono text-sm leading-6 resize-none outline-none border-none"
                placeholder="Start coding..."
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <Card className="m-4 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Code Preview</h3>
                </div>
                <div 
                  className="font-mono text-sm bg-editor-background p-4 rounded-lg border border-border overflow-auto"
                  dangerouslySetInnerHTML={{ 
                    __html: activeFile ? syntaxHighlight(activeFile.content, activeFile.language) : '' 
                  }}
                />
              </div>
            </Card>
          </ScrollArea>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Language: {selectedLanguage}</span>
          {activeFile && (
            <>
              <span>Lines: {activeFile.content.split('\n').length}</span>
              <span>Characters: {activeFile.content.length}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFile?.isModified && (
            <span className="text-warning">● Modified</span>
          )}
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;