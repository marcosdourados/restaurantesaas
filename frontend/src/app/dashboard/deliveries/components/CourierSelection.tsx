'use client';

import { useState } from 'react';
import { X, User, Phone, Car, Check } from 'lucide-react';

// Tipos
type Courier = {
  id: string;
  name: string;
  phone: string;
  vehicle?: string;
  available: boolean;
};

interface CourierSelectionProps {
  couriers: Courier[];
  onClose: () => void;
  onSelect: (courierId: string) => void;
  deliveryId: string;
}

export default function CourierSelection({
  couriers,
  onClose,
  onSelect,
  deliveryId
}: CourierSelectionProps) {
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);

  // Confirma a seleção do entregador
  const confirmSelection = () => {
    if (selectedCourierId) {
      onSelect(selectedCourierId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <User className="mr-2" size={20} />
            Selecionar Entregador
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {couriers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Não há entregadores disponíveis no momento.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Selecione um entregador disponível para atribuir à entrega.
              </p>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
              {couriers.map((courier) => (
                <div 
                  key={courier.id}
                  onClick={() => setSelectedCourierId(courier.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer
                    ${selectedCourierId === courier.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${selectedCourierId === courier.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}
                      `}>
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-medium">{courier.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Phone size={12} className="mr-1" />
                          {courier.phone}
                        </p>
                      </div>
                    </div>
                    
                    {courier.vehicle && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Car size={14} className="mr-1" />
                        {courier.vehicle}
                      </div>
                    )}
                    
                    {selectedCourierId === courier.id && (
                      <div className="flex-shrink-0 text-primary">
                        <Check size={20} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSelection}
                disabled={!selectedCourierId}
                className={`
                  px-4 py-2 rounded-md flex items-center
                  ${selectedCourierId 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
              >
                <Check size={16} className="mr-1" />
                Confirmar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 