import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold">Página Não Encontrada</h2>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <Link href="/">
        <Button 
          variant="default"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Voltar para Home
        </Button>
      </Link>
    </div>
  );
} 