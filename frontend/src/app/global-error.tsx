'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-8">
            <Utensils className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">RestauranteSaaS</span>
          </div>
          
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Ops! Ocorreu um erro</h1>
            <p className="text-gray-600 mb-6">
              Algo inesperado aconteceu. Nossa equipe foi notificada e 
              estamos trabalhando para resolver o problema.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-white">
                Tentar novamente
              </Button>
              <Link href="/" passHref>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 