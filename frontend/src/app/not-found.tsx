'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Utensils, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Utensils className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-primary">RestauranteSaaS</span>
      </div>
      
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <div className="inline-flex p-4 rounded-full bg-red-50 mb-6">
          <Search className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" passHref>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Voltar ao início
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Ir para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 