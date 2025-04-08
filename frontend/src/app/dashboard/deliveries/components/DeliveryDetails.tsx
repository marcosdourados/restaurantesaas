'use client';

import { X, Truck, MapPin, User, Phone, DollarSign, Clock, Check } from 'lucide-react';

// Tipos
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

interface DeliveryDetailsProps {
  delivery: Delivery;
  onClose: () => void;
  onAssignCourier: (delivery: Delivery) => void;
  onUpdateStatus: (deliveryId: string, status: Delivery['status']) => void;
  formatDateTime: (date: Date) => string;
  formatAddress: (address: Delivery['address']) => string;
  translateStatus: (status: Delivery['status']) => string;
  getStatusColor: (status: Delivery['status']) => string;
}

export default function DeliveryDetails({
  delivery,
  onClose,
  onAssignCourier,
  onUpdateStatus,
  formatDateTime,
  formatAddress,
  translateStatus,
  getStatusColor
}: DeliveryDetailsProps) {
  // Formata valor para exibição em reais
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Truck className="mr-2" size={20} />
            Entrega {delivery.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Status atual */}
        <div className="mb-6">
          <div className="flex items-center">
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(delivery.status)}`}>
              {translateStatus(delivery.status)}
            </span>
            
            {delivery.estimatedDeliveryTime && (
              <div className="ml-4 text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                Previsão: {formatDateTime(delivery.estimatedDeliveryTime)}
              </div>
            )}
          </div>
        </div>
        
        {/* Informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cliente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="mr-2" size={16} />
              Informações do Cliente
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{delivery.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium flex items-center">
                  <Phone className="mr-1" size={14} />
                  {delivery.customer.phone}
                </p>
              </div>
            </div>
          </div>
          
          {/* Endereço */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin className="mr-2" size={16} />
              Endereço de Entrega
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                {formatAddress(delivery.address)}
              </p>
              <p className="text-sm">
                CEP: {delivery.address.zipCode}
              </p>
              {delivery.address.complement && (
                <p className="text-sm">
                  Complemento: {delivery.address.complement}
                </p>
              )}
            </div>
          </div>
          
          {/* Entregador */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <Truck className="mr-2" size={16} />
              Entregador
            </h3>
            {delivery.courier ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{delivery.courier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium flex items-center">
                    <Phone className="mr-1" size={14} />
                    {delivery.courier.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 italic mb-3">Nenhum entregador atribuído</p>
                {delivery.status === 'pending' && (
                  <button
                    onClick={() => onAssignCourier(delivery)}
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm"
                  >
                    Atribuir Entregador
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Valores */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <DollarSign className="mr-2" size={16} />
              Informações do Pedido
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Pedido</p>
                <p className="font-medium">{delivery.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="font-medium">
                  {formatDateTime(delivery.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor Total</p>
                <p className="font-medium text-green-700">
                  {formatCurrency(delivery.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Timeline</h3>
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            <div className="relative">
              <div className="absolute -left-[17px] w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <Clock size={16} />
              </div>
              <div className="ml-4">
                <p className="font-medium">Pedido Criado</p>
                <p className="text-sm text-gray-500">{formatDateTime(delivery.createdAt)}</p>
              </div>
            </div>
            
            {delivery.courier && (
              <div className="relative">
                <div className={`absolute -left-[17px] w-8 h-8 rounded-full flex items-center justify-center text-white ${delivery.status === 'pending' ? 'bg-gray-400' : 'bg-blue-500'}`}>
                  <User size={16} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Entregador Atribuído</p>
                  <p className="text-sm text-gray-500">
                    {delivery.courier.name}
                  </p>
                </div>
              </div>
            )}
            
            {delivery.startedAt && (
              <div className="relative">
                <div className="absolute -left-[17px] w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                  <Truck size={16} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Saiu para Entrega</p>
                  <p className="text-sm text-gray-500">{formatDateTime(delivery.startedAt)}</p>
                </div>
              </div>
            )}
            
            {delivery.deliveredAt && (
              <div className="relative">
                <div className="absolute -left-[17px] w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check size={16} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Entrega Concluída</p>
                  <p className="text-sm text-gray-500">{formatDateTime(delivery.deliveredAt)}</p>
                </div>
              </div>
            )}
            
            {delivery.status === 'canceled' && (
              <div className="relative">
                <div className="absolute -left-[17px] w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <X size={16} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">Entrega Cancelada</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Ações */}
        <div className="border-t border-gray-200 pt-4 flex flex-wrap gap-2 justify-end">
          {/* Botões de ação baseados no status atual */}
          {delivery.status === 'pending' && !delivery.courier && (
            <button
              onClick={() => onAssignCourier(delivery)}
              className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
            >
              <User size={16} className="mr-1" />
              Atribuir Entregador
            </button>
          )}
          
          {delivery.status === 'assigned' && (
            <button
              onClick={() => onUpdateStatus(delivery.id, 'out_for_delivery')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center"
            >
              <Truck size={16} className="mr-1" />
              Iniciar Entrega
            </button>
          )}
          
          {delivery.status === 'out_for_delivery' && (
            <button
              onClick={() => onUpdateStatus(delivery.id, 'delivered')}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center"
            >
              <Check size={16} className="mr-1" />
              Confirmar Entrega
            </button>
          )}
          
          {(delivery.status === 'pending' || delivery.status === 'assigned') && (
            <button
              onClick={() => onUpdateStatus(delivery.id, 'canceled')}
              className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center"
            >
              <X size={16} className="mr-1" />
              Cancelar Entrega
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 