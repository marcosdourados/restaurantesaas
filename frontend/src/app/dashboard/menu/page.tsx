'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductTab from './components/ProductTab';
import CategoryTab from './components/CategoryTab';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Cardápio</h1>
        <Link href="/dashboard/menu/settings">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings size={16} />
            Configurações
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductTab />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
} 