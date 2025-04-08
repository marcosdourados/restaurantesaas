'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search,
  QrCode,
  RefreshCcw
} from 'lucide-react';

// Tipo para representar dados de mesa
type Table = {
  id: string;
  number: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  areaName: string;
};

export default function TablesPage() {
  // Estado para armazenar lista de mesas
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);

  // Estados para formulário
  const [formData, setFormData] = useState({
    number: '',
    seats: 4,
    areaId: '',
    status: 'available',
  });

  // Dados fictícios para áreas
  const areas = [
    { id: 'area1', name: 'Salão Principal' },
    { id: 'area2', name: 'Área Externa' },
    { id: 'area3', name: 'Mezanino' },
  ];

  // Simula carregamento de dados
  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      const mockTables: Table[] = Array.from({ length: 15 }).map((_, index) => ({
        id: `table-${index + 1}`,
        number: `${index + 1}`,
        seats: Math.floor(Math.random() * 6) + 2,
        status: ['available', 'occupied', 'reserved', 'maintenance'][
          Math.floor(Math.random() * 4)
        ] as Table['status'],
        areaName: areas[Math.floor(Math.random() * areas.length)].name,
      }));
      
      setTables(mockTables);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra mesas baseado na busca
  const filteredTables = tables.filter(table => 
    table.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.areaName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abre modal para adicionar/editar mesa
  const openModal = (table: Table | null = null) => {
    if (table) {
      // Editar mesa existente
      setFormData({
        number: table.number,
        seats: table.seats,
        areaId: areas.find(a => a.name === table.areaName)?.id || '',
        status: table.status,
      });
      setCurrentTable(table);
    } else {
      // Nova mesa
      setFormData({
        number: '',
        seats: 4,
        areaId: areas[0].id,
        status: 'available',
      });
      setCurrentTable(null);
    }
    setShowModal(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Manipula alterações no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seats' ? parseInt(value) : value,
    }));
  };

  // Salva o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de salvar dados
    if (currentTable) {
      // Atualiza mesa existente
      setTables(prev =>
        prev.map(table =>
          table.id === currentTable.id
            ? {
                ...table,
                number: formData.number,
                seats: formData.seats,
                status: formData.status as Table['status'],
                areaName: areas.find(a => a.id === formData.areaId)?.name || '',
              }
            : table
        )
      );
    } else {
      // Adiciona nova mesa
      const newTable: Table = {
        id: `table-${Date.now()}`,
        number: formData.number,
        seats: formData.seats,
        status: formData.status as Table['status'],
        areaName: areas.find(a => a.id === formData.areaId)?.name || '',
      };
      
      setTables(prev => [...prev, newTable]);
    }
    
    closeModal();
  };

  // Remove uma mesa
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mesa?')) {
      setTables(prev => prev.filter(table => table.id !== id));
    }
  };

  // Gera cores para os status
  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduz os status
  const getStatusTranslation = (status: Table['status']) => {
    const translations = {
      available: 'Disponível',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      maintenance: 'Manutenção'
    };
    return translations[status];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Mesas</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nova Mesa
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mesas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
          >
            <RefreshCcw size={18} className="mr-2" />
            Limpar
          </button>
        </div>
      </div>

      {/* Tabela de mesas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Carregando mesas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidade
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
                {filteredTables.map((table) => (
                  <tr key={table.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Mesa {table.number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{table.areaName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={16} className="mr-1" />
                        {table.seats} {table.seats === 1 ? 'pessoa' : 'pessoas'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(table.status)}`}>
                        {getStatusTranslation(table.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => openModal(table)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        onClick={() => alert(`QR Code para a Mesa ${table.number}`)}
                      >
                        <QrCode size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(table.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Adicionar/Editar Mesa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentTable ? 'Editar Mesa' : 'Nova Mesa'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Número da Mesa
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Área
                </label>
                <select
                  name="areaId"
                  value={formData.areaId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capacidade (pessoas)
                </label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  max="20"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="available">Disponível</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="maintenance">Manutenção</option>
                </select>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 