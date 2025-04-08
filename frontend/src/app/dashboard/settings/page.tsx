'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, User, Building, Bell, Shield, Globe, CreditCard } from 'lucide-react';
import IntegrationList from './components/IntegrationList';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState({
    name: 'João Silva',
    email: 'joao@restaurante.com',
    phone: '(11) 98765-4321',
    avatar: '',
    bio: 'Gerente do restaurante desde 2020, com experiência em gastronomia e administração.'
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: 'Restaurante Brasileiro',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    phone: '(11) 3456-7890',
    logo: '',
    openingHours: '11:00 - 23:00',
    description: 'Especializado em culinária brasileira com ambiente acolhedor e serviço de qualidade.'
  });

  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    newFeatures: true,
    smsNotifications: false
  });

  const [securityForm, setSecurityForm] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiration: '90'
  });

  const [integrationForm, setIntegrationForm] = useState({
    googleMaps: true,
    facebook: false,
    instagram: true,
    ifood: true,
    rappi: false
  });

  const [paymentForm, setPaymentForm] = useState({
    currentPlan: 'professional',
    paymentMethod: 'credit_card',
    cardEnding: '4321'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRestaurantForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (category: string, name: string, checked: boolean) => {
    if (category === 'notifications') {
      setNotificationForm(prev => ({ ...prev, [name]: checked }));
    } else if (category === 'security') {
      setSecurityForm(prev => ({ ...prev, [name]: checked }));
    } else if (category === 'integrations') {
      setIntegrationForm(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleSecuritySelectChange = (name: string, value: string) => {
    setSecurityForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelectChange = (name: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulando um delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aqui faria a chamada à API para salvar as configurações
      
      // Simulando sucesso
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e do restaurante.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Restaurante</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Pagamento</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Perfil */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileForm.avatar || ''} alt={profileForm.name} />
                  <AvatarFallback className="text-lg">{profileForm.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Alterar foto
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileForm.name} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profileForm.email} 
                    onChange={handleProfileChange} 
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileForm.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={profileForm.bio} 
                    onChange={handleProfileChange} 
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab: Restaurante */}
        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Restaurante</CardTitle>
              <CardDescription>
                Atualize as informações do seu estabelecimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={restaurantForm.logo || ''} alt={restaurantForm.name} />
                  <AvatarFallback className="text-lg">{restaurantForm.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Alterar logo
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Nome do restaurante</Label>
                  <Input 
                    id="restaurantName" 
                    name="name" 
                    value={restaurantForm.name} 
                    onChange={handleRestaurantChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone de contato</Label>
                  <Input 
                    id="restaurantPhone" 
                    name="phone" 
                    value={restaurantForm.phone} 
                    onChange={handleRestaurantChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={restaurantForm.address} 
                  onChange={handleRestaurantChange} 
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Horário de funcionamento</Label>
                  <Input 
                    id="openingHours" 
                    name="openingHours" 
                    value={restaurantForm.openingHours} 
                    onChange={handleRestaurantChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={restaurantForm.description} 
                    onChange={handleRestaurantChange} 
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab: Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Gerencie como você deseja receber notificações do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por e-mail</p>
                  <p className="text-sm text-muted-foreground">Receba notificações por e-mail sobre atividades importantes.</p>
                </div>
                <Switch 
                  checked={notificationForm.emailNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('notifications', 'emailNotifications', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações de pedidos</p>
                  <p className="text-sm text-muted-foreground">Seja notificado sobre novos pedidos e alterações de status.</p>
                </div>
                <Switch 
                  checked={notificationForm.orderNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('notifications', 'orderNotifications', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">E-mails de marketing</p>
                  <p className="text-sm text-muted-foreground">Receba dicas e promoções para melhorar seu restaurante.</p>
                </div>
                <Switch 
                  checked={notificationForm.marketingEmails} 
                  onCheckedChange={(checked) => handleSwitchChange('notifications', 'marketingEmails', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Novas funcionalidades</p>
                  <p className="text-sm text-muted-foreground">Fique por dentro de novos recursos e atualizações do sistema.</p>
                </div>
                <Switch 
                  checked={notificationForm.newFeatures} 
                  onCheckedChange={(checked) => handleSwitchChange('notifications', 'newFeatures', checked)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por SMS</p>
                  <p className="text-sm text-muted-foreground">Receba alertas importantes via mensagem de texto.</p>
                </div>
                <Switch 
                  checked={notificationForm.smsNotifications} 
                  onCheckedChange={(checked) => handleSwitchChange('notifications', 'smsNotifications', checked)} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab: Segurança */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as opções de segurança da sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticação de dois fatores</p>
                  <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta.</p>
                </div>
                <Switch 
                  checked={securityForm.twoFactor} 
                  onCheckedChange={(checked) => handleSwitchChange('security', 'twoFactor', checked)} 
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tempo limite da sessão (minutos)</Label>
                  <Select 
                    value={securityForm.sessionTimeout} 
                    onValueChange={(value) => handleSecuritySelectChange('sessionTimeout', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiration">Expiração de senha (dias)</Label>
                  <Select 
                    value={securityForm.passwordExpiration} 
                    onValueChange={(value) => handleSecuritySelectChange('passwordExpiration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="60">60 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                      <SelectItem value="365">365 dias</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Alterar senha
                </Button>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                  Sessões ativas
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab: Integrações */}
        <TabsContent value="integrations" className="space-y-4">
          <IntegrationList />
        </TabsContent>

        {/* Tab: Pagamentos */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano e Pagamento</CardTitle>
              <CardDescription>
                Gerencie seu plano e informações de pagamento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPlan">Plano atual</Label>
                <Select 
                  value={paymentForm.currentPlan} 
                  onValueChange={(value) => handlePaymentSelectChange('currentPlan', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Básico - R$ 99/mês</SelectItem>
                    <SelectItem value="professional">Profissional - R$ 199/mês</SelectItem>
                    <SelectItem value="enterprise">Empresarial - R$ 399/mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6 px-4 pb-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Plano</p>
                        <p className="text-lg font-bold">Profissional</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Valor</p>
                        <p className="text-lg font-bold">R$ 199,00/mês</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Próxima cobrança</p>
                        <p>15/04/2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-green-600 font-medium">Ativo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de pagamento</Label>
                <Select 
                  value={paymentForm.paymentMethod} 
                  onValueChange={(value) => handlePaymentSelectChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Cartão de crédito</SelectItem>
                    <SelectItem value="bank_slip">Boleto bancário</SelectItem>
                    <SelectItem value="bank_transfer">Transferência bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Cartão atual</p>
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>•••• •••• •••• {paymentForm.cardEnding}</span>
                  </div>
                  <Button variant="outline" size="sm">Alterar</Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Ver histórico de faturas
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 