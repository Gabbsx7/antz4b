'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Send, 
  X, 
  AlertTriangle, 
  Lightbulb, 
  CheckSquare, 
  HelpCircle, 
  Zap,
  Check,
  Eye,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { useAgentEvents } from '@/lib/agent-events';
import { formatRelativeTime } from '@/lib/format';
import { toast } from 'sonner';
import type { AgentEvent, AgentMessage } from '@/lib/types';

const eventIcons = {
  alert: AlertTriangle,
  insight: Lightbulb,
  task: CheckSquare,
  explanation: HelpCircle,
  action: Zap,
};

const severityColors = {
  high: 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800',
  medium: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
  low: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
};

const quickPrompts = [
  'Explicar variação de margem',
  'Gerar briefing para board',
  'Criar régua de cobrança',
  'Analisar burn rate',
  'Sugerir otimizações',
];

export function AgentPanel() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    agentPanelOpen, 
    setAgentPanelOpen, 
    agentEvents, 
    agentMessages,
    addAgentMessage,
    markEventAsDone,
    dismissEvent
  } = useAppStore();
  
  const { processCommand } = useAgentEvents();

  const handleSendMessage = async () => {
    if (!message.trim() || isProcessing) return;

    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    addAgentMessage(userMessage);
    setMessage('');
    setIsProcessing(true);

    try {
      const response = await processCommand(message);
      
      const agentMessage: AgentMessage = {
        id: `msg-${Date.now()}-agent`,
        type: 'agent',
        content: response,
        timestamp: new Date().toISOString(),
      };

      addAgentMessage(agentMessage);
    } catch (error) {
      toast.error('Erro ao processar comando');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const handleEventAction = (event: AgentEvent) => {
    if (event.cta) {
      router.push(event.cta.href);
      setAgentPanelOpen(false);
      toast.success(`Navegando para ${event.cta.label}`);
    }
  };

  const handleMarkAsDone = (eventId: string) => {
    markEventAsDone(eventId);
    toast.success('Evento marcado como concluído');
  };

  const handleDismiss = (eventId: string) => {
    dismissEvent(eventId);
    toast.success('Evento dispensado');
  };

  return (
    <Sheet open={agentPanelOpen} onOpenChange={setAgentPanelOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-600" />
            Ant'z Agent
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-5rem)]">
          {/* Events Feed */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Alertas Recentes
              </h3>
              
              {agentEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum evento recente</p>
                  <p className="text-sm">O Agent irá notificar sobre insights importantes</p>
                </div>
              ) : (
                agentEvents.map((event) => {
                  const Icon = eventIcons[event.type];
                  const isOpen = event.status === 'open';
                  
                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${
                        event.severity ? severityColors[event.severity] : 'bg-card'
                      } ${!isOpen ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-4 w-4 mt-0.5 ${
                          event.severity === 'high' ? 'text-rose-600' :
                          event.severity === 'medium' ? 'text-amber-600' :
                          'text-blue-600'
                        }`} />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className="flex items-center gap-1">
                              {event.severity && (
                                <Badge 
                                  variant={event.severity === 'high' ? 'destructive' : 
                                          event.severity === 'medium' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {event.severity}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                          
                          {event.body && (
                            <p className="text-sm text-muted-foreground">{event.body}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(event.timestamp)}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              {event.cta && isOpen && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEventAction(event)}
                                  className="h-7 text-xs"
                                >
                                  {event.cta.label}
                                </Button>
                              )}
                              
                              {isOpen && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleMarkAsDone(event.id)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDismiss(event.id)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Chat Messages */}
              {agentMessages.length > 0 && (
                <>
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mt-8">
                    Conversa
                  </h3>
                  
                  <div className="space-y-3">
                    {agentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            msg.type === 'user'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-emerald-100' : 'text-muted-foreground'
                          }`}>
                            {formatRelativeTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* Quick Prompts */}
          <div className="border-t p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Pergunte algo ao Agent..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isProcessing}
                size="icon"
              >
                {isProcessing ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
