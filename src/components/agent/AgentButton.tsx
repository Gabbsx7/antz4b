'use client';

import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppStore } from '@/lib/store';

export function AgentButton() {
  const { setAgentPanelOpen, agentEvents } = useAppStore();
  
  const unreadEvents = agentEvents.filter(event => event.status === 'open').length;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setAgentPanelOpen(true)}
          >
            <Bot className="h-5 w-5 md:h-6 md:w-6" />
            {unreadEvents > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-5 w-5 md:h-6 md:w-6 rounded-full p-0 text-xs flex items-center justify-center animate-pulse"
              >
                {unreadEvents > 9 ? '9+' : unreadEvents}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-4">
          <p>Ant'z Agent (⌘I)</p>
          {unreadEvents > 0 && (
            <p className="text-xs text-muted-foreground">
              {unreadEvents} {unreadEvents === 1 ? 'novo alerta' : 'novos alertas'}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
