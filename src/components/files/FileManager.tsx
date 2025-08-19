import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Folder, 
  File, 
  Plus, 
  FolderPlus, 
  Search, 
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  size?: number;
  modified: Date;
  children?: FileItem[];
  content?: string;
}

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void;
  onFileCreate?: (file: FileItem) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ onFileSelect, onFileCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));
  
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'My Projects',
      type: 'folder',
      modified: new Date(),
      children: [
        {
          id: '2',
          name: 'react-app',
          type: 'folder',
          modified: new Date(),
          children: [
            {
              id: '3',
              name: 'App.js',
              type: 'file',
              language: 'javascript',
              size: 2048,
              modified: new Date(),
              content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;'
            },
            {
              id: '4',
              name: 'index.html',
              type: 'file',
              language: 'html',
              size: 512,
              modified: new Date(),
              content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>React App</title>\n</head>\n<body>\n  <div id="root"></div>\n</body>\n</html>'
            }
          ]
        },
        {
          id: '5',
          name: 'python-scripts',
          type: 'folder',
          modified: new Date(),
          children: [
            {
              id: '6',
              name: 'hello.py',
              type: 'file',
              language: 'python',
              size: 128,
              modified: new Date(),
              content: 'def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")'
            }
          ]
        }
      ]
    }
  ]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      onFileSelect?.(file);
    } else {
      toggleFolder(file.id);
    }
  };

  const createNewItem = () => {
    if (!newFileName.trim()) return;
    
    const newItem: FileItem = {
      id: Date.now().toString(),
      name: newFileName,
      type: newFileType,
      modified: new Date(),
      size: newFileType === 'file' ? 0 : undefined,
      content: newFileType === 'file' ? '' : undefined,
      children: newFileType === 'folder' ? [] : undefined
    };

    // For simplicity, add to root
    setFiles(prev => [...prev, newItem]);
    onFileCreate?.(newItem);
    
    setNewFileName('');
    setIsCreateDialogOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-4 h-4 text-accent" />;
    }
    return <File className="w-4 h-4 text-muted-foreground" />;
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items
      .filter(item => 
        searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => (
        <div key={item.id}>
          <div 
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
              level > 0 ? `ml-${level * 4}` : ''
            }`}
            onClick={() => handleFileSelect(item)}
            style={{ paddingLeft: `${8 + level * 16}px` }}
          >
            {getFileIcon(item)}
            <span className="flex-1 text-sm text-foreground truncate">
              {item.name}
            </span>
            
            {item.type === 'file' && item.size !== undefined && (
              <span className="text-xs text-muted-foreground">
                {formatFileSize(item.size)}
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {item.type === 'folder' && 
           item.children && 
           expandedFolders.has(item.id) && (
            <div>
              {renderFileTree(item.children, level + 1)}
            </div>
          )}
        </div>
      ));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-surface border border-border rounded-lg shadow-medium overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">File Manager</h3>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={newFileType === 'file' ? 'default' : 'outline'}
                    onClick={() => setNewFileType('file')}
                    className="flex-1"
                  >
                    <File className="w-4 h-4 mr-2" />
                    File
                  </Button>
                  <Button
                    variant={newFileType === 'folder' ? 'default' : 'outline'}
                    onClick={() => setNewFileType('folder')}
                    className="flex-1"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Folder
                  </Button>
                </div>
                <Input
                  placeholder={`${newFileType} name`}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewItem()}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewItem} disabled={!newFileName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {renderFileTree(files)}
        </div>
      </ScrollArea>

      {/* Stats */}
      <div className="p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>{files.length} items</span>
          <span>Last modified: {formatDate(new Date())}</span>
        </div>
      </div>
    </div>
  );
};

export default FileManager;