'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Erro na aplicação:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">Ocorreu um erro</h1>
        <p className="text-muted-foreground">
          Desculpe pelo inconveniente. Por favor, tente novamente.
        </p>
      </div>
      <Button 
        onClick={reset} 
        variant="default"
        className="flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Tentar Novamente
      </Button>
    </div>
  );
} 