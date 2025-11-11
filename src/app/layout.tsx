import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { TopNav } from '@/components/layout/TopNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { AgentButton } from '@/components/agent/AgentButton';
import { AgentPanel } from '@/components/agent/AgentPanel';
import { CommandPalette } from '@/components/command-palette';
import { Toaster } from '@/components/ui/sonner';
import { AgentEventProvider } from '@/components/agent/AgentEventProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Ant'z For Business - Protótipo",
  description: 'Ecossistema inteligente de gestão financeira e operacional',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AgentEventProvider>
            <div className="min-h-screen bg-background">
              <TopNav />
              <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 md:ml-0">
                  {children}
                </main>
              </div>
              
              {/* Agent Components */}
              <AgentButton />
              <AgentPanel />
              
              {/* Command Palette */}
              <CommandPalette />
              
              {/* Toast Notifications */}
              <Toaster />
            </div>
          </AgentEventProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}