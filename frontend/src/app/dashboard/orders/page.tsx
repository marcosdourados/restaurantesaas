'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCcw, 
  ExternalLink, 
  Printer,
  Check,
  X,
  Clock,
  UtensilsCrossed
} from 'lucide-react';

// Tipo para representar dados de pedido
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  number: string;
  type: 'local' | 'delivery' | 'takeout';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'canceled';
  tableName?: string;
  customerName?: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
};

export default function OrdersPage() {
  // Estado para armazenar lista de pedidos
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    date: '',
  });

  // Simula carregamento de dados
  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      const mockOrders: Order[] = Array.from({ length: 12 }).map((_, index) => {
        const orderType = ['local', 'delivery', 'takeout'][Math.floor(Math.random() * 3)] as Order['type'];
        const orderStatus = ['pending', 'preparing', 'ready', 'delivered', 'canceled'][
          Math.floor(Math.random() * 5)
        ] as Order['status'];
        
        const mockItems: OrderItem[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, itemIndex) => ({
          id: `item-${index}-${itemIndex}`,
          name: ['Pizza Margherita', 'Hamburger Clássico', 'Salada Caesar', 'Água Mineral', 'Refrigerante', 'Batata Frita'][
            Math.floor(Math.random() * 6)
          ],
          quantity: Math.floor(Math.random() * 3) + 1,
          price: parseFloat((Math.random() * 50 + 10).toFixed(2))
        }));
        
        const total = mockItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        
        // Subtrai um número aleatório de horas da data atual
        const orderDate = new Date();
        orderDate.setHours(orderDate.getHours() - Math.floor(Math.random() * 24));
        
        return {
          id: `order-${index + 1}`,
          number: `#${1000 + index}`,
          type: orderType,
          status: orderStatus,
          tableName: orderType === 'local' ? `Mesa ${Math.floor(Math.random() * 15) + 1}` : undefined,
          customerName: orderType !== 'local' ? ['João Silva', 'Maria Souza', 'Carlos Oliveira', 'Ana Santos'][Math.floor(Math.random() * 4)] : undefined,
          items: mockItems,
          total,
          createdAt: orderDate
        };
      });
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra pedidos baseado na busca e filtros
  const filteredOrders = orders.filter(order => {
    let matchesSearch = true;
    let matchesFilters = true;
    
    // Verifica busca
    if (searchTerm) {
      matchesSearch = 
        order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableName || '').toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Verifica filtros
    if (filters.status && order.status !== filters.status) {
      matchesFilters = false;
    }
    
    if (filters.type && order.type !== filters.type) {
      matchesFilters = false;
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      const orderDate = new Date(order.createdAt);
      
      if (filterDate.toDateString() !== orderDate.toDateString()) {
        matchesFilters = false;
      }
    }
    
    return matchesSearch && matchesFilters;
  });

  // Reseta os filtros
  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      date: '',
    });
    setSearchTerm('');
  };

  // Atualiza o status de um pedido
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
  };

  // Formata data
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Traduz tipo de pedido
  const translateOrderType = (type: Order['type']) => {
    const translations = {
      local: 'Local',
      delivery: 'Entrega',
      takeout: 'Para Viagem'
    };
    return translations[type];
  };

  // Traduz status do pedido
  const translateOrderStatus = (status: Order['status']) => {
    const translations = {
      pending: 'Pendente',
      preparing: 'Em Preparo',
      ready: 'Pronto',
      delivered: 'Entregue',
      canceled: 'Cancelado'
    };
    return translations[status];
  };

  // Retorna cor do status
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Exibe detalhes do pedido
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <button
          onClick={() => alert('Adicionar novo pedido')}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Novo Pedido
        </button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            Filtros
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
          >
            <RefreshCcw size={18} className="mr-2" />
            Limpar
          </button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value as Order['status']})}
              >
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="preparing">Em Preparo</option>
                <option value="ready">Pronto</option>
                <option value="delivered">Entregue</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value as Order['type']})}
              >
                <option value="">Todos</option>
                <option value="local">Local</option>
                <option value="delivery">Entrega</option>
                <option value="takeout">Para Viagem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Carregando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Mesa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => showOrderDetails(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{translateOrderType(order.type)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {order.tableName || order.customerName || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        R$ {order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {translateOrderStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-gray-600 hover:text-gray-900 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Imprimir pedido ${order.number}`);
                        }}
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          showOrderDetails(order);
                        }}
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalhes do pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Pedido {selectedOrder.number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Tipo de Pedido</p>
                <p className="font-medium">{translateOrderType(selectedOrder.type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data e Hora</p>
                <p className="font-medium">{formatDateTime(selectedOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {selectedOrder.type === 'local' ? 'Mesa' : 'Cliente'}
                </p>
                <p className="font-medium">
                  {selectedOrder.tableName || selectedOrder.customerName || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                  {translateOrderStatus(selectedOrder.status)}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Itens do Pedido</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">
                          {item.quantity}x {item.name}
                        </span>
                      </div>
                      <div className="text-gray-700">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between font-bold">
                  <div>Total</div>
                  <div>R$ {selectedOrder.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3">Ações</h3>
              <div className="flex flex-wrap gap-2">
                {/* Botões de ação baseados no status atual */}
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'preparing');
                        setSelectedOrder(prev => prev ? {...prev, status: 'preparing'} : null);
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center"
                    >
                      <Clock size={16} className="mr-1" />
                      Iniciar Preparo
                    </button>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'canceled');
                        setSelectedOrder(prev => prev ? {...prev, status: 'canceled'} : null);
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded-md flex items-center"
                    >
                      <X size={16} className="mr-1" />
                      Cancelar
                    </button>
                  </>
                )}
                
                {selectedOrder.status === 'preparing' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'ready');
                        setSelectedOrder(prev => prev ? {...prev, status: 'ready'} : null);
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-md flex items-center"
                    >
                      <Check size={16} className="mr-1" />
                      Marcar como Pronto
                    </button>
                  </>
                )}
                
                {selectedOrder.status === 'ready' && (
                  <>
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'delivered');
                        setSelectedOrder(prev => prev ? {...prev, status: 'delivered'} : null);
                      }}
                      className="px-3 py-2 bg-purple-600 text-white rounded-md flex items-center"
                    >
                      <Check size={16} className="mr-1" />
                      Confirmar Entrega
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => alert(`Imprimir pedido ${selectedOrder.number}`)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md flex items-center"
                >
                  <Printer size={16} className="mr-1" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 