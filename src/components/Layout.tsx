import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 w-full h-16 bg-card/80 backdrop-blur-sm border-b border-border z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link 
            to={ROUTE_PATHS.HOME}
            className="text-xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors"
          >
            QR Card Game
          </Link>
        </div>
      </header>
      
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}
