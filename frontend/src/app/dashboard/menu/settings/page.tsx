'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, AlertCircle } from 'lucide-react';

export default function MenuSettingsPage() {
  const [activeTab, setActiveTab] = useState('geral');
  
  // Estados para as configurações gerais
  const [showPrices, setShowPrices] = useState(true);
  const [enableOrderOnline, setEnableOrderOnline] = useState(true);
  const [enablePromotions, setEnablePromotions] = useState(true);
  const [menuLayout, setMenuLayout] = useState('grid');
  const [menuLanguage, setMenuLanguage] = useState('pt-BR');
  
  // Estados para as notificações
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [notifyOutOfStock, setNotifyOutOfStock] = useState(true);
  
  // Simulação de salvamento
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      
      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurações do Cardápio</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações do seu cardápio e menu</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Salvar Alterações</span>
            </>
          )}
        </Button>
      </div>
      
      {savedSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-center">
          <div className="p-1 bg-green-200 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p>Configurações salvas com sucesso!</p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Configurações Gerais</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="avancado">Configurações Avançadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Cardápio</CardTitle>
              <CardDescription>
                Configure as opções gerais de exibição e funcionamento do cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Exibir preços no cardápio</h3>
                  <p className="text-sm text-gray-500">Quando desativado, os preços não serão exibidos no cardápio público</p>
                </div>
                <Switch 
                  checked={showPrices}
                  onCheckedChange={setShowPrices}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Permitir pedidos online</h3>
                  <p className="text-sm text-gray-500">Habilitar a opção de clientes fazerem pedidos diretamente pelo cardápio</p>
                </div>
                <Switch 
                  checked={enableOrderOnline}
                  onCheckedChange={setEnableOrderOnline}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Habilitar promoções</h3>
                  <p className="text-sm text-gray-500">Exibir produtos em promoção com destaque no cardápio</p>
                </div>
                <Switch 
                  checked={enablePromotions}
                  onCheckedChange={setEnablePromotions}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="menuLayout">Layout do Cardápio</Label>
                  <Select value={menuLayout} onValueChange={setMenuLayout}>
                    <SelectTrigger id="menuLayout">
                      <SelectValue placeholder="Selecione um layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grade com imagens</SelectItem>
                      <SelectItem value="list">Lista simples</SelectItem>
                      <SelectItem value="cards">Cartões detalhados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="menuLanguage">Idioma Principal</Label>
                  <Select value={menuLanguage} onValueChange={setMenuLanguage}>
                    <SelectTrigger id="menuLanguage">
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure quais notificações deseja receber relacionadas ao cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Notificar estoque baixo</h3>
                  <p className="text-sm text-gray-500">Receber alertas quando um produto estiver com estoque baixo</p>
                </div>
                <Switch 
                  checked={notifyLowStock}
                  onCheckedChange={setNotifyLowStock}
                />
              </div>
              
              {notifyLowStock && (
                <div className="ml-6 border-l-2 border-gray-200 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Limite de estoque baixo</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      min="1"
                      className="w-32"
                    />
                    <p className="text-sm text-gray-500">Quantidade mínima para considerar o estoque baixo</p>
                  </div>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Notificar produtos esgotados</h3>
                  <p className="text-sm text-gray-500">Receber alertas quando um produto ficar sem estoque</p>
                </div>
                <Switch 
                  checked={notifyOutOfStock}
                  onCheckedChange={setNotifyOutOfStock}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="avancado">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Configurações avançadas para personalização do cardápio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                <p className="font-medium mb-1">Atenção</p>
                <p className="text-sm">Estas configurações são para usuários avançados. Alterações incorretas podem afetar o funcionamento do seu cardápio.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cacheTime">Tempo de Cache (minutos)</Label>
                <Input
                  id="cacheTime"
                  type="number"
                  defaultValue="60"
                  min="5"
                  className="w-32"
                />
                <p className="text-sm text-gray-500">Tempo que o cardápio ficará em cache antes de ser atualizado</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="customCss">CSS Personalizado</Label>
                <textarea
                  id="customCss"
                  className="w-full h-32 rounded-md border border-gray-300 p-2 font-mono text-sm"
                  placeholder="/* Adicione seu CSS personalizado aqui */"
                ></textarea>
                <p className="text-sm text-gray-500">CSS personalizado para seu cardápio público</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 