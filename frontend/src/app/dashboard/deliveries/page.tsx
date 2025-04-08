'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCcw, 
  ExternalLink, 
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone
} from 'lucide-react';
import DeliveryDetails from './components/DeliveryDetails';
import CourierSelection from './components/CourierSelection';

// Tipos
type Courier = {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
  available: boolean;
};

type Delivery = {
  id: string;
  orderId: string;
  orderNumber: string;
  status: 'pending' | 'assigned' | 'out_for_delivery' | 'delivered' | 'canceled';
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
  };
  customer: {
    name: string;
    phone: string;
  };
  courier?: {
    id: string;
    name: string;
    phone: string;
  };
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  startedAt?: Date;
  deliveredAt?: Date;
  totalAmount: number;
};

export default function DeliveriesPage() {
  // Estados
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showCourierSelection, setShowCourierSelection] = useState(false);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    status: '',
    courierId: '',
    date: '',
  });

  // Simula carregamento de dados
  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      // Entregadores mockados
      const mockCouriers: Courier[] = [
        { id: 'courier-1', name: 'João Silva', phone: '(11) 98765-4321', vehicle: 'Moto', available: true },
        { id: 'courier-2', name: 'Maria Souza', phone: '(11) 91234-5678', vehicle: 'Bicicleta', available: true },
        { id: 'courier-3', name: 'Carlos Oliveira', phone: '(11) 99876-5432', vehicle: 'Carro', available: false },
        { id: 'courier-4', name: 'Ana Santos', phone: '(11) 95555-4444', vehicle: 'Moto', available: true },
      ];
      
      // Entregas mockadas
      const mockDeliveries: Delivery[] = Array.from({ length: 12 }).map((_, index) => {
        // Status aleatório
        const statuses = ['pending', 'assigned', 'out_for_delivery', 'delivered', 'canceled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as Delivery['status'];
        
        // Data criada (entre hoje e 3 dias atrás)
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 3));
        date.setHours(date.getHours() - Math.floor(Math.random() * 12));
        
        // Entregador (apenas para entregas não pendentes)
        const hasCourier = status !== 'pending' && status !== 'canceled';
        const courier = hasCourier 
          ? { 
              id: mockCouriers[Math.floor(Math.random() * mockCouriers.length)].id,
              name: mockCouriers[Math.floor(Math.random() * mockCouriers.length)].name,
              phone: mockCouriers[Math.floor(Math.random() * mockCouriers.length)].phone
            }
          : undefined;
        
        // Datas de entrega
        let estimatedDeliveryTime, startedAt, deliveredAt;
        
        if (status !== 'pending' && status !== 'canceled') {
          estimatedDeliveryTime = new Date(date);
          estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45);
        }
        
        if (status === 'out_for_delivery' || status === 'delivered') {
          startedAt = new Date(date);
          startedAt.setMinutes(startedAt.getMinutes() + 15);
        }
        
        if (status === 'delivered') {
          deliveredAt = new Date(date);
          deliveredAt.setMinutes(deliveredAt.getMinutes() + 40);
        }
        
        return {
          id: `delivery-${index + 1}`,
          orderId: `order-${1000 + index}`,
          orderNumber: `#${1000 + index}`,
          status,
          address: {
            street: 'Rua das Flores',
            number: `${Math.floor(Math.random() * 1000) + 1}`,
            complement: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 100) + 1}` : undefined,
            neighborhood: 'Centro',
            city: 'São Paulo',
            zipCode: '01000-000'
          },
          customer: {
            name: ['João Silva', 'Maria Souza', 'Carlos Oliveira', 'Ana Santos'][Math.floor(Math.random() * 4)],
            phone: '(11) 9' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000)
          },
          courier,
          createdAt: date,
          estimatedDeliveryTime,
          startedAt,
          deliveredAt,
          totalAmount: parseFloat((Math.random() * 200 + 30).toFixed(2))
        };
      });
      
      setCouriers(mockCouriers);
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra entregas baseado na busca e filtros
  const filteredDeliveries = deliveries.filter(delivery => {
    let matchesSearch = true;
    let matchesFilters = true;
    
    // Verifica busca
    if (searchTerm) {
      matchesSearch = 
        delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address.street.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Verifica filtros
    if (filters.status && delivery.status !== filters.status) {
      matchesFilters = false;
    }
    
    if (filters.courierId && (!delivery.courier || delivery.courier.id !== filters.courierId)) {
      matchesFilters = false;
    }
    
    if (filters.date) {
      const filterDate = new Date(filters.date);
      const deliveryDate = new Date(delivery.createdAt);
      
      if (filterDate.toDateString() !== deliveryDate.toDateString()) {
        matchesFilters = false;
      }
    }
    
    return matchesSearch && matchesFilters;
  });

  // Reseta os filtros
  const resetFilters = () => {
    setFilters({
      status: '',
      courierId: '',
      date: '',
    });
    setSearchTerm('');
  };

  // Formata data e hora
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Formata endereço para exibição
  const formatAddress = (address: Delivery['address']) => {
    return `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''} - ${address.neighborhood}, ${address.city}`;
  };

  // Traduz status
  const translateStatus = (status: Delivery['status']) => {
    const translations = {
      pending: 'Pendente',
      assigned: 'Atribuído',
      out_for_delivery: 'Em Entrega',
      delivered: 'Entregue',
      canceled: 'Cancelado'
    };
    return translations[status];
  };

  // Retorna cor do status
  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Exibe detalhes da entrega
  const showDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
  };

  // Abre o modal para seleção de entregador
  const openCourierSelection = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowCourierSelection(true);
  };

  // Atribui um entregador à entrega
  const assignCourier = (courierId: string) => {
    if (!selectedDelivery) return;
    
    const courier = couriers.find(c => c.id === courierId);
    if (!courier) return;
    
    // Atualiza a entrega com o novo entregador
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === selectedDelivery.id
          ? {
              ...delivery,
              status: 'assigned' as Delivery['status'],
              courier: {
                id: courier.id,
                name: courier.name,
                phone: courier.phone
              },
              estimatedDeliveryTime: new Date(new Date().getTime() + 45 * 60000) // Agora + 45 minutos
            }
          : delivery
      )
    );
    
    setShowCourierSelection(false);
  };

  // Atualiza o status de uma entrega
  const updateDeliveryStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(prev => 
      prev.map(delivery => {
        if (delivery.id === deliveryId) {
          const updatedDelivery = { ...delivery, status: newStatus };
          
          // Atualiza outras informações baseadas no status
          if (newStatus === 'out_for_delivery') {
            updatedDelivery.startedAt = new Date();
          } else if (newStatus === 'delivered') {
            updatedDelivery.deliveredAt = new Date();
          }
          
          return updatedDelivery;
        }
        return delivery;
      })
    );
    
    // Atualiza a entrega selecionada se estiver aberta
    if (selectedDelivery && selectedDelivery.id === deliveryId) {
      setSelectedDelivery(prev => {
        if (!prev) return null;
        
        const updated = { ...prev, status: newStatus };
        
        if (newStatus === 'out_for_delivery') {
          updated.startedAt = new Date();
        } else if (newStatus === 'delivered') {
          updated.deliveredAt = new Date();
        }
        
        return updated;
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Entregas</h1>
      
      {/* Barra de busca e filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar entregas..."
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
                onChange={(e) => setFilters({...filters, status: e.target.value as Delivery['status']})}
              >
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="assigned">Atribuído</option>
                <option value="out_for_delivery">Em Entrega</option>
                <option value="delivered">Entregue</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entregador
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={filters.courierId}
                onChange={(e) => setFilters({...filters, courierId: e.target.value})}
              >
                <option value="">Todos</option>
                {couriers.map(courier => (
                  <option key={courier.id} value={courier.id}>
                    {courier.name}
                  </option>
                ))}
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

      {/* Lista de entregas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Carregando entregas...</p>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="p-8 text-center">
            <Truck size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma entrega encontrada</p>
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
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entregador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr 
                    key={delivery.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => showDeliveryDetails(delivery)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{delivery.orderNumber}</div>
                      <div className="text-xs text-gray-500">
                        <Calendar size={12} className="inline mr-1" />
                        {formatDateTime(delivery.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium flex items-center">
                          <User size={14} className="mr-1" />
                          {delivery.customer.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Phone size={12} className="mr-1" />
                          {delivery.customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 flex items-start">
                        <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{formatAddress(delivery.address)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.courier ? (
                        <div className="text-sm text-gray-900">{delivery.courier.name}</div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Não atribuído</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                        {translateStatus(delivery.status)}
                      </span>
                      {delivery.estimatedDeliveryTime && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {formatDateTime(delivery.estimatedDeliveryTime)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          showDeliveryDetails(delivery);
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

      {/* Modal de detalhes da entrega */}
      {selectedDelivery && (
        <DeliveryDetails
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onAssignCourier={openCourierSelection}
          onUpdateStatus={updateDeliveryStatus}
          formatDateTime={formatDateTime}
          formatAddress={formatAddress}
          translateStatus={translateStatus}
          getStatusColor={getStatusColor}
        />
      )}

      {/* Modal de seleção de entregador */}
      {showCourierSelection && selectedDelivery && (
        <CourierSelection
          couriers={couriers.filter(c => c.available)}
          onClose={() => setShowCourierSelection(false)}
          onSelect={assignCourier}
          deliveryId={selectedDelivery.id}
        />
      )}
    </div>
  );
} 