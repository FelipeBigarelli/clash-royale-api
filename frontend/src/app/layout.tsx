import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export const metadata: Metadata = {
  title: 'Clash Dashboard',
  description: 'Painel de colaboração do clã Clash Royale',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-slate-200 min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
          <TopBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
