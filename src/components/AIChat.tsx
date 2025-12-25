import { useState, useRef, useEffect } from 'react';
import { Send, X, Upload, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CVData } from '@/types/cv';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  cvData: CVData;
  onUpdate: (data: Partial<CVData>) => void;
  onClose: () => void;
}

const AIChat = ({ cvData, onUpdate, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI CV assistant. I can help you:\n\n• Generate compelling CV content\n• Tailor your CV to a job description\n• Improve your professional summary\n• Suggest better ways to describe your experience\n\nPaste a job description or tell me what you'd like to improve!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call the AI backend)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input, cvData),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (userInput: string, cv: CVData): string => {
    const lowercaseInput = userInput.toLowerCase();
    
    if (lowercaseInput.includes('job description') || lowercaseInput.includes('jd')) {
      return `I've analyzed the job description. Here are my suggestions to tailor your CV:\n\n**Key Skills to Highlight:**\n• Add relevant technical skills mentioned in the JD\n• Emphasize leadership experience if mentioned\n• Include specific metrics and achievements\n\n**Summary Enhancement:**\nI recommend updating your professional summary to better align with the role. Would you like me to generate a new summary based on this job description?`;
    }
    
    if (lowercaseInput.includes('summary') || lowercaseInput.includes('about')) {
      return `Here's an improved professional summary based on your experience:\n\n"${cv.personalInfo.title} with extensive experience in building and leading high-performance teams. Proven track record of delivering scalable solutions that drive business growth. Expert in modern technologies with a passion for mentoring and continuous improvement."\n\nWould you like me to refine this further or make it more specific to a particular role?`;
    }
    
    if (lowercaseInput.includes('experience') || lowercaseInput.includes('work')) {
      return `I can help improve your experience descriptions! Here are some tips:\n\n**Use Action Verbs:**\n• Led, Developed, Implemented, Optimized\n\n**Include Metrics:**\n• "Increased performance by 40%"\n• "Managed team of 10 engineers"\n\n**Focus on Impact:**\n• What problems did you solve?\n• What was the business outcome?\n\nWhich experience would you like me to help enhance?`;
    }

    return `I understand you want to improve your CV. Here's what I can help with:\n\n1. **Optimize for ATS** - Ensure your CV passes automated screening\n2. **Strengthen Language** - Use impactful verbs and metrics\n3. **Tailor to Role** - Customize for specific job descriptions\n4. **Highlight Achievements** - Focus on results, not just duties\n\nWhat specific aspect would you like to work on? Or paste a job description for personalized suggestions.`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card lg:rounded-xl lg:border lg:border-border lg:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 lg:rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by AI</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              message.role === 'assistant' ? 'bg-primary/10' : 'bg-accent/10'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-accent" />
              )}
            </div>
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.role === 'assistant' 
                ? 'bg-muted text-foreground rounded-tl-none' 
                : 'bg-primary text-primary-foreground rounded-tr-none'
            )}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Upload Job Description">
            <Upload className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to improve your CV or paste a job description..."
              className="min-h-[44px] max-h-32 pr-12 resize-none"
              rows={1}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 bottom-1"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can help generate and refine your CV content
        </p>
      </div>
    </div>
  );
};

export default AIChat;
