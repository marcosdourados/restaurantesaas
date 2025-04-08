'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, Lock, Mail, User, Store, Phone } from 'lucide-react';

export default function Register() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    phone: '',
    plan: planParam || 'basic',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, plan: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }

    setIsLoading(true);

    try {
      // Simulando registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em um cenário real, aqui faria a chamada para a API de registro
      router.push('/dashboard');
    } catch (err) {
      setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white py-8">
      <div className="flex justify-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <Utensils className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">RestauranteSaaS</span>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
            <p className="text-gray-600 mt-2">
              Preencha as informações abaixo para começar a usar o sistema
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações pessoais */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Informações pessoais</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800">Nome completo</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800">Senha</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-800">Confirmar senha</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do restaurante */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Informações do estabelecimento</h2>
              
              <div className="space-y-2">
                <Label htmlFor="restaurantName" className="text-gray-800">Nome do restaurante</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Store className="h-4 w-4" />
                  </div>
                  <Input
                    id="restaurantName"
                    name="restaurantName"
                    type="text"
                    placeholder="Nome do seu estabelecimento"
                    className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-800">Telefone</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="pl-10 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-primary"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-gray-800">Plano</Label>
                <Select 
                  value={formData.plan} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="border-gray-300 text-gray-800 focus:border-primary">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico - R$ 99/mês</SelectItem>
                    <SelectItem value="professional">Profissional - R$ 199/mês</SelectItem>
                    <SelectItem value="enterprise">Empresarial - R$ 399/mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-tight text-gray-700">
                Eu concordo com os{' '}
                <Link href="/terms" className="text-primary hover:text-primary/90 font-medium">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/90 font-medium">
                  Política de Privacidade
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 