'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCcw,
  X, 
  Image,
  Filter,
  DollarSign
} from 'lucide-react';

// Tipos
type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  categoryId: string;
  categoryName: string;
  imageUrl?: string;
  available: boolean;
};

export default function ProductTab() {
  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Estados para filtros
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Estados para formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    categoryId: '',
    available: true,
  });

  // Simula carregamento de dados
  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      const mockCategories: Category[] = [
        { id: 'cat-1', name: 'Pratos Principais' },
        { id: 'cat-2', name: 'Entradas' },
        { id: 'cat-3', name: 'Bebidas' },
        { id: 'cat-4', name: 'Sobremesas' },
        { id: 'cat-5', name: 'Alcoólicos' }
      ];
      
      const mockProducts: Product[] = Array.from({ length: 20 }).map((_, index) => {
        const categoryIndex = Math.floor(Math.random() * mockCategories.length);
        const category = mockCategories[categoryIndex];
        
        return {
          id: `prod-${index + 1}`,
          name: [
            'Pizza Margherita', 'Hambúrguer Clássico', 'Salada Caesar', 
            'Água Mineral', 'Refrigerante', 'Batata Frita', 'Espaguete Carbonara',
            'Risoto de Funghi', 'Ceviche', 'Tiramisu', 'Petit Gateau',
            'Cerveja', 'Caipirinha', 'Sushi', 'Sashimi', 'Yakisoba', 
            'Filé Mignon', 'Picanha', 'Costela'
          ][Math.floor(Math.random() * 19)],
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at est orci.',
          price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
          cost: parseFloat((Math.random() * 50 + 5).toFixed(2)),
          categoryId: category.id,
          categoryName: category.name,
          imageUrl: 'https://placehold.co/300x200',
          available: Math.random() > 0.2 // 80% de chance de estar disponível
        };
      });
      
      setCategories(mockCategories);
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtra produtos baseado na busca e filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? product.categoryId === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

  // Abre modal para adicionar/editar produto
  const openModal = (product: Product | null = null) => {
    if (product) {
      // Editar produto existente
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        cost: product.cost?.toString() || '',
        categoryId: product.categoryId,
        available: product.available,
      });
      setCurrentProduct(product);
    } else {
      // Novo produto
      setFormData({
        name: '',
        description: '',
        price: '',
        cost: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        available: true,
      });
      setCurrentProduct(null);
    }
    setShowModal(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Manipula alterações no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'price' || name === 'cost') {
      // Limita a entrada apenas para números e um ponto decimal
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  // Salva o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Converte valores de string para número
    const price = parseFloat(formData.price);
    const cost = formData.cost ? parseFloat(formData.cost) : undefined;
    
    if (isNaN(price) || (formData.cost && isNaN(cost!))) {
      alert('Por favor, informe valores válidos para preço e custo.');
      return;
    }
    
    // Busca o nome da categoria
    const category = categories.find(c => c.id === formData.categoryId);
    if (!category) {
      alert('Categoria inválida.');
      return;
    }
    
    // Simulação de salvar dados
    if (currentProduct) {
      // Atualiza produto existente
      setProducts(prev =>
        prev.map(product =>
          product.id === currentProduct.id
            ? {
                ...product,
                name: formData.name,
                description: formData.description,
                price,
                cost,
                categoryId: formData.categoryId,
                categoryName: category.name,
                available: formData.available,
              }
            : product
        )
      );
    } else {
      // Adiciona novo produto
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price,
        cost,
        categoryId: formData.categoryId,
        categoryName: category.name,
        imageUrl: 'https://placehold.co/300x200',
        available: formData.available
      };
      
      setProducts(prev => [...prev, newProduct]);
    }
    
    closeModal();
  };

  // Remove um produto
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  // Formata valor para exibição em reais
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Produtos</h2>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Novo Produto
        </button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
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
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setShowFilters(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
          >
            <RefreshCcw size={18} className="mr-2" />
            Limpar
          </button>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de produtos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Carregando produtos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.categoryName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{formatCurrency(product.price)}</div>
                      {product.cost && (
                        <div className="text-xs text-gray-500">
                          Custo: {formatCurrency(product.cost)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => openModal(product)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(product.id)}
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

      {/* Modal para Adicionar/Editar Produto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome do Produto *
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
                
                <div className="md:col-span-2">
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
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Categoria *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    name="available"
                    value={formData.available.toString()}
                    onChange={(e) => setFormData({...formData, available: e.target.value === 'true'})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="true">Disponível</option>
                    <option value="false">Indisponível</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Preço de Venda (R$) *
                  </label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Custo (R$)
                  </label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="pl-10 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Imagem
                  </label>
                  <div className="flex items-center">
                    <div className="w-32 h-24 bg-gray-100 rounded flex items-center justify-center mr-4">
                      {currentProduct?.imageUrl ? (
                        <img
                          src={currentProduct.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Image size={32} className="text-gray-400" />
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
              </div>
              
              <div className="flex justify-end mt-6">
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