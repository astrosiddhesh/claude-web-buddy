import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

interface TerminalProps {
  title?: string;
  initialLines?: TerminalLine[];
}

const Terminal: React.FC<TerminalProps> = ({ 
  title = "Claude Web Buddy",
  initialLines = []
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'system',
      content: `✳ Welcome to ${title} research preview!`,
      timestamp: new Date()
    },
    {
      id: '2', 
      type: 'success',
      content: '✓ Found 1 MCP server • /mcp',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'success', 
      content: '✓ Loaded project + user memory • /memory',
      timestamp: new Date()
    },
    ...initialLines
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({
    sessionId: '63b06cac1dfb47b6b9e21c63b164bc9d',
    workdir: '~/dev/github.com/claude-web-buddy',
    model: 'claude-sonnet-4',
    approval: 'suggest'
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const addLine = (type: TerminalLine['type'], content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const handleCommand = async (command: string) => {
    // Add user input to terminal
    addLine('input', `> ${command}`);
    setCurrentInput('');
    
    // Handle special commands
    if (command === '/clear') {
      setLines([]);
      return;
    }
    
    if (command === '/help') {
      addLine('system', 'Available commands:');
      addLine('system', '  /clear - Clear terminal');
      addLine('system', '  /help - Show this help');
      addLine('system', '  /models - List available models'); 
      addLine('system', '  /session - Show session info');
      addLine('system', '  /code <language> - Generate code');
      addLine('system', '  /review - Review current code');
      addLine('system', '  /explain - Explain code concepts');
      addLine('system', '  /debug - Debug assistance');
      addLine('system', '  q or ctrl+c - Exit');
      return;
    }
    
    if (command === '/models') {
      addLine('system', 'Available AI models:');
      addLine('success', '  ● claude-sonnet-4 (current) - Best for complex reasoning');
      addLine('system', '  ○ claude-opus-4 - Most capable for difficult tasks');
      addLine('system', '  ○ gpt-5 - Latest OpenAI flagship model');
      addLine('system', '  ○ gpt-4.1 - Reliable and fast');
      addLine('system', '  ○ o4-mini - Quick responses and coding');
      addLine('system', '');
      addLine('system', 'Use: /model <name> to switch models');
      return;
    }
    
    if (command === '/session') {
      addLine('system', `Session ID: ${sessionInfo.sessionId}`);
      addLine('system', `Workdir: ${sessionInfo.workdir}`);
      addLine('system', `Model: ${sessionInfo.model}`);
      addLine('system', `Approval: ${sessionInfo.approval}`);
      return;
    }
    
    if (command === 'q' || command === 'exit') {
      addLine('system', 'Goodbye!');
      return;
    }

    // Enhanced AI processing simulation
    setIsThinking(true);
    
    // Simulate realistic AI processing time
    setTimeout(() => {
      setIsThinking(false);
      
      // Enhanced command responses
      if (command.toLowerCase().includes('brainstorm') || command.toLowerCase().includes('fix')) {
        addLine('system', "● I'll search for information about this issue and brainstorm potential fixes.");
        addLine('success', `Fetch(https://github.com/anthropics/claude-code/issues/427)...`);
        addLine('system', '└ Received 286.3KB (200 OK)');
        addLine('system', "● Let me brainstorm potential fixes for implementing these prompt guidelines enforcement features in Claude CLI.");
        addLine('success', 'Search(pattern: "**/utils/permissions/**")...');
        addLine('system', '└ Found 12 relevant files');
        addLine('system', "● Here are some potential approaches:");
        addLine('system', '  1. Implement role-based permission system');
        addLine('system', '  2. Add command validation middleware');
        addLine('system', '  3. Create user preference enforcement');
      } else if (command.toLowerCase().includes('explain')) {
        addLine('system', "● I'll analyze this codebase and explain its structure and functionality.");
        addLine('success', 'Analyzing project structure...');
        addLine('system', '└ Scanning 47 files, 12,500 lines of code');
        addLine('system', 'This is a React-based terminal interface that simulates CLI tools like Claude Code and OpenAI Codex.');
        addLine('system', 'Key components: Terminal UI, command processing, AI response simulation.');
      } else if (command.toLowerCase().includes('code')) {
        addLine('system', `● Generating code for: ${command.replace('/code', '').trim()}`);
        addLine('success', 'Initializing code generation...');
        addLine('system', '└ Language detected, templates loaded');
        addLine('system', "I'm ready to help you write code! What specifically would you like me to create?");
      } else if (command.toLowerCase().includes('debug')) {
        addLine('system', "● Debug mode activated");
        addLine('success', 'Scanning for common issues...');
        addLine('system', '└ No immediate errors detected');
        addLine('system', "Share your code or error message and I'll help debug it!");
      } else if (command.toLowerCase().includes('review')) {
        addLine('system', "● Code review mode");
        addLine('success', 'Preparing analysis tools...');
        addLine('system', '└ Ready to review code quality, security, and performance');
        addLine('system', "Paste your code and I'll provide a detailed review!");
      } else {
        addLine('system', `● Processing: "${command}"`);
        addLine('system', "I'm your AI coding assistant. I can help you:");
        addLine('system', "  • Write and generate code");
        addLine('system', "  • Debug and fix issues");
        addLine('system', "  • Review and optimize code");
        addLine('system', "  • Explain programming concepts");
        addLine('system', "What would you like to work on?");
      }
    }, 800 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      handleCommand(currentInput.trim());
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-foreground';
      case 'system': return 'text-muted-foreground';
      case 'success': return 'text-terminal-green';
      case 'error': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '';
      case 'success': return '';
      case 'error': return '✗ ';
      case 'system': return '';
      default: return '';
    }
  };

  return (
    <div className="h-full flex flex-col bg-editor-background font-mono text-sm">
      {/* Terminal Header */}
      <div className="p-4 border-b border-border bg-card/20">
        {/* Terminal Header with Welcome Box */}
        <div className="border border-terminal-orange rounded p-3 mb-4">
          <div className="text-terminal-orange">✳ Welcome to {title} research preview!</div>
        </div>
        <p className="text-center text-muted-foreground mb-4">
          Lightweight coding agent that runs in your browser
        </p>
        
        {/* Session Info Box */}
        <div className="bg-muted/20 border border-border rounded p-3 space-y-1 text-xs">
          <div className="text-primary">● {title} (research preview) v0.1.04152057</div>
          <div className="pl-4 space-y-1 text-muted-foreground">
            <div>localhost session: {sessionInfo.sessionId}</div>
            <div>↳ workdir: {sessionInfo.workdir}</div>
            <div>↳ model: {sessionInfo.model}</div>
            <div>↳ approval: {sessionInfo.approval}</div>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto space-y-1"
      >
        {lines.map((line, index) => (
          <div 
            key={line.id} 
            className={`${getLineColor(line.type)} leading-relaxed animate-fade-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {getLinePrefix(line.type)}{line.content}
          </div>
        ))}
        
        {isThinking && (
          <div className="text-muted-foreground animate-fade-in">
            <span className="animate-pulse">( ● ) Thinking...</span>
          </div>
        )}
        
        {/* Current Input Line */}
        <div className="flex items-center animate-fade-in">
          <span className="text-primary mr-2 font-bold">user</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-foreground caret-primary focus:ring-0"
            placeholder={isThinking ? "Please wait..." : "Type your message or command..."}
            disabled={isThinking}
            autoComplete="off"
            spellCheck={false}
          />
          {!isThinking && (
            <div className="text-muted-foreground text-xs animate-pulse">
              ⏎
            </div>
          )}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="p-2 border-t border-border bg-card/20 text-xs text-muted-foreground text-center">
        send q or ctrl+c to exit | send "/clear" to reset | send "/help" for commands | press enter to send
      </div>
    </div>
  );
};

export default Terminal;