'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import CategoryTab from './components/CategoryTab';
import ProductTab from './components/ProductTab';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('products');
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Cardápio</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-6">
          <ProductTab />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <CategoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
} 