'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCcw,
  X, 
  Image
} from 'lucide-react';

// Tipo para representar dados de categoria
type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
  productCount: number;
};

export default function CategoryTab() {
  // Estado para armazenar lista de categorias
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  // Estados para formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });

  // Simula carregamento de dados
  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      const mockCategories: Category[] = [
        {
          id: 'cat-1',
          name: 'Pratos Principais',
          description: 'Pratos completos para refeições',
          imageUrl: 'https://placehold.co/100x100',
          active: true,
          productCount: 12
        },
        {
          id: 'cat-2',
          name: 'Entradas',
          description: 'Aperitivos e porções para compartilhar',
          imageUrl: 'https://placehold.co/100x100',
          active: true,
          productCount: 8
        },
        {
          id: 'cat-3',
          name: 'Bebidas',
          description: 'Bebidas não alcoólicas',
          imageUrl: 'https://placehold.co/100x100',
          active: true,
          productCount: 15
        },
        {
          id: 'cat-4',
          name: 'Sobremesas',
          description: 'Doces e sobremesas especiais',
          imageUrl: 'https://placehold.co/100x100',
          active: true,
          productCount: 6
        },
        {
          id: 'cat-5',
          name: 'Alcoólicos',
          description: 'Bebidas alcoólicas',
          imageUrl: 'https://placehold.co/100x100',
          active: false,
          productCount: 10
        }
      ];
      
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra categorias baseado na busca
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abre modal para adicionar/editar categoria
  const openModal = (category: Category | null = null) => {
    if (category) {
      // Editar categoria existente
      setFormData({
        name: category.name,
        description: category.description || '',
        active: category.active,
      });
      setCurrentCategory(category);
    } else {
      // Nova categoria
      setFormData({
        name: '',
        description: '',
        active: true,
      });
      setCurrentCategory(null);
    }
    setShowModal(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Manipula alterações no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Salva o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de salvar dados
    if (currentCategory) {
      // Atualiza categoria existente
      setCategories(prev =>
        prev.map(category =>
          category.id === currentCategory.id
            ? {
                ...category,
                name: formData.name,
                description: formData.description,
                active: formData.active,
              }
            : category
        )
      );
    } else {
      // Adiciona nova categoria
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        imageUrl: 'https://placehold.co/100x100',
        active: formData.active,
        productCount: 0
      };
      
      setCategories(prev => [...prev, newCategory]);
    }
    
    closeModal();
  };

  // Remove uma categoria
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prev => prev.filter(category => category.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Categorias</h2>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nova Categoria
        </button>
      </div>

      {/* Barra de busca */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar categorias..."
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

      {/* Lista de categorias */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Carregando categorias...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produtos
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
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{category.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.productCount} produtos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => openModal(category)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(category.id)}
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

      {/* Modal para Adicionar/Editar Categoria */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagem
                </label>
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center mr-4">
                    {currentCategory?.imageUrl ? (
                      <img
                        src={currentCategory.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Image size={24} className="text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
                    onClick={() => alert('Funcionalidade de upload não implementada neste exemplo')}
                  >
                    Escolher Imagem
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-gray-700">Categoria ativa</span>
                </label>
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