'use client';

import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Users, 
  ShoppingBag, 
  Truck, 
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  // Dados fictícios para demonstração
  const [stats, setStats] = useState({
    ordersToday: 0,
    activesTables: 0,
    totalRevenue: 0,
    pendingDeliveries: 0
  });

  // Simula busca de dados
  useEffect(() => {
    // Aqui seria uma chamada de API
    setStats({
      ordersToday: 24,
      activesTables: 8,
      totalRevenue: 1580.75,
      pendingDeliveries: 5
    });
  }, []);

  // Cards de estatísticas
  const statCards = [
    { 
      title: 'Pedidos Hoje', 
      value: stats.ordersToday, 
      icon: UtensilsCrossed, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Mesas Ativas', 
      value: stats.activesTables, 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Faturamento Hoje', 
      value: `R$ ${stats.totalRevenue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Entregas Pendentes', 
      value: stats.pendingDeliveries, 
      icon: Truck, 
      color: 'bg-orange-500' 
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seções principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
          <div className="space-y-4">
            {/* Exibir lista de pedidos recentes aqui */}
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">#12345</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Em preparo</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Mesa 5 • 3 itens • R$ 124,90</p>
                <p className="mt-1 text-xs">Há 10 minutos</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">#12344</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Entregue</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Delivery • 5 itens • R$ 156,50</p>
                <p className="mt-1 text-xs">Há 25 minutos</p>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">#12343</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Pronto</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Mesa 2 • 2 itens • R$ 89,00</p>
                <p className="mt-1 text-xs">Há 30 minutos</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mesas Disponíveis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Lista de mesas */}
            {Array.from({ length: 12 }).map((_, index) => {
              const isOccupied = [0, 2, 5, 7].includes(index);
              return (
                <div 
                  key={index}
                  className={`
                    p-4 rounded-md flex flex-col items-center justify-center
                    ${isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                  `}
                >
                  <Users size={20} />
                  <span className="mt-1 font-medium">Mesa {index + 1}</span>
                  <span className="text-xs mt-1">{isOccupied ? 'Ocupada' : 'Livre'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 