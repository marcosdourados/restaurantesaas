'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter">Erro na Aplicação</h1>
            <p className="text-lg text-muted-foreground">
              Ocorreu um erro ao carregar a aplicação. Por favor, tente novamente.
            </p>
          </div>
          <Button 
            onClick={reset} 
            variant="default"
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Reiniciar Aplicação
          </Button>
        </div>
      </body>
    </html>
  );
} 