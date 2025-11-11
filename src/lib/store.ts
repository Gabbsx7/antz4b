// Store global usando Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AppSettings, AgentEvent, AgentMessage } from './types';

interface AppState {
  // Configurações
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Usuário atual
  user: User | null;
  setUser: (user: User) => void;
  
  // Agent
  agentEvents: AgentEvent[];
  agentMessages: AgentMessage[];
  addAgentEvent: (event: AgentEvent) => void;
  addAgentMessage: (message: AgentMessage) => void;
  markEventAsDone: (eventId: string) => void;
  dismissEvent: (eventId: string) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  agentPanelOpen: boolean;
  setAgentPanelOpen: (open: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Configurações padrão
      settings: {
        theme: 'system',
        currency: 'BRL',
        businessUnit: 'all',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // Usuário mock
      user: {
        id: '1',
        name: 'Gabriel Henrique',
        email: 'gabriel@antz.com',
        role: 'admin',
        avatar: 'https://github.com/shadcn.png',
        businessUnits: ['all', 'sul', 'sudeste', 'nordeste'],
      },
      setUser: (user) => set({ user }),
      
      // Agent
      agentEvents: [],
      agentMessages: [],
      addAgentEvent: (event) =>
        set((state) => ({
          agentEvents: [event, ...state.agentEvents],
        })),
      addAgentMessage: (message) =>
        set((state) => ({
          agentMessages: [...state.agentMessages, message],
        })),
      markEventAsDone: (eventId) =>
        set((state) => ({
          agentEvents: state.agentEvents.map((event) =>
            event.id === eventId ? { ...event, status: 'done' } : event
          ),
        })),
      dismissEvent: (eventId) =>
        set((state) => ({
          agentEvents: state.agentEvents.map((event) =>
            event.id === eventId ? { ...event, status: 'dismissed' } : event
          ),
        })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      agentPanelOpen: false,
      setAgentPanelOpen: (open) => set({ agentPanelOpen: open }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'antz-app-storage',
      partialize: (state) => ({
        settings: state.settings,
        user: state.user,
        agentMessages: state.agentMessages,
      }),
    }
  )
);
