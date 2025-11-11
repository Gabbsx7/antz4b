'use client';

import { useEffect } from 'react';
import { useAgentEvents } from '@/lib/agent-events';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import type { AgentEvent } from '@/lib/types';

export function AgentEventProvider({ children }: { children: React.ReactNode }) {
  const { addAgentEvent } = useAppStore();
  const agentEvents = useAgentEvents();

  useEffect(() => {
    // Inicia o sistema de eventos do Agent
    agentEvents.start();

    // Escuta novos eventos
    const handleNewEvent = (event: AgentEvent) => {
      addAgentEvent(event);
      
      // Mostra toast para eventos de alta prioridade
      if (event.severity === 'high') {
        toast.error(event.title, {
          description: event.body,
          action: event.cta ? {
            label: event.cta.label,
            onClick: () => window.location.href = event.cta!.href,
          } : undefined,
        });
      } else if (event.severity === 'medium') {
        toast.warning(event.title, {
          description: event.body,
        });
      } else {
        toast.info(event.title, {
          description: event.body,
        });
      }
    };

    agentEvents.on('newEvent', handleNewEvent);

    // Cleanup
    return () => {
      agentEvents.off('newEvent', handleNewEvent);
      agentEvents.stop();
    };
  }, [addAgentEvent, agentEvents]);

  return <>{children}</>;
}
