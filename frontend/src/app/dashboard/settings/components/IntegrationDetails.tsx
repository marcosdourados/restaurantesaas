'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { X, Save, RotateCw, LinkIcon } from 'lucide-react';

type IntegrationDetailsProps = {
  integration: {
    id: string;
    name: string;
    description: string;
    logo: string;
    enabled: boolean;
    apiKey?: string;
    webhookUrl?: string;
    status: 'connected' | 'disconnected' | 'error';
    config?: Record<string, string>;
  };
  onClose: () => void;
  onSave: (integration: any) => void;
};

export default function IntegrationDetails({ integration, onClose, onSave }: IntegrationDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...integration,
    config: integration.config || {}
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      enabled: checked
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulando um delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar integração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizações específicas baseadas no tipo de integração
  const renderIntegrationSpecificFields = () => {
    switch (integration.id) {
      case 'google_maps':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave de API</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={formData.apiKey || ''} 
                onChange={handleInputChange}
                placeholder="Insira sua chave de API do Google Maps" 
              />
              <p className="text-xs text-muted-foreground">
                A chave de API é usada para acesso aos serviços do Google Maps.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Configurações do Mapa</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="zoom" className="text-xs">Zoom Padrão</Label>
                  <Input 
                    id="zoom" 
                    type="number" 
                    min="1" 
                    max="20" 
                    value={formData.config?.zoom || "14"} 
                    onChange={(e) => handleConfigChange('zoom', e.target.value)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mapType" className="text-xs">Tipo de Mapa</Label>
                  <Input 
                    id="mapType" 
                    value={formData.config?.mapType || "roadmap"} 
                    onChange={(e) => handleConfigChange('mapType', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 'ifood':
      case 'rappi':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave de Acesso</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={formData.apiKey || ''} 
                onChange={handleInputChange}
                placeholder={`Insira sua chave de acesso do ${integration.name}`} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input 
                id="webhookUrl" 
                name="webhookUrl" 
                value={formData.webhookUrl || ''} 
                onChange={handleInputChange}
                placeholder="URL para receber atualizações de pedidos" 
              />
              <p className="text-xs text-muted-foreground">
                Essa URL receberá notificações de novos pedidos e alterações de status.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Opções de Pedidos</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Aceitar pedidos automaticamente</p>
                  <p className="text-xs text-muted-foreground">Os pedidos serão aceitos sem intervenção manual</p>
                </div>
                <Switch 
                  checked={formData.config?.autoAccept === "true"} 
                  onCheckedChange={(checked) => handleConfigChange('autoAccept', checked.toString())} 
                />
              </div>
            </div>
          </>
        );
      case 'facebook':
      case 'instagram':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="apiKey">Access Token</Label>
              <Input 
                id="apiKey" 
                name="apiKey" 
                value={formData.apiKey || ''} 
                onChange={handleInputChange}
                placeholder={`Insira o token de acesso do ${integration.name}`} 
              />
            </div>
            <div className="space-y-2">
              <Label>ID da Página/Conta</Label>
              <Input 
                value={formData.config?.pageId || ""} 
                onChange={(e) => handleConfigChange('pageId', e.target.value)} 
                placeholder="ID da sua página ou conta"
              />
            </div>
            <div className="space-y-2">
              <Label>Opções de Compartilhamento</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Compartilhar novos produtos</p>
                  <p className="text-xs text-muted-foreground">Publicar automaticamente novos produtos no cardápio</p>
                </div>
                <Switch 
                  checked={formData.config?.shareProducts === "true"} 
                  onCheckedChange={(checked) => handleConfigChange('shareProducts', checked.toString())} 
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-sm font-medium">Compartilhar promoções</p>
                  <p className="text-xs text-muted-foreground">Publicar automaticamente novas promoções</p>
                </div>
                <Switch 
                  checked={formData.config?.sharePromotions === "true"} 
                  onCheckedChange={(checked) => handleConfigChange('sharePromotions', checked.toString())} 
                />
              </div>
            </div>
          </>
        );
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave de API</Label>
            <Input 
              id="apiKey" 
              name="apiKey" 
              value={formData.apiKey || ''} 
              onChange={handleInputChange}
              placeholder="Insira sua chave de API" 
            />
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-2xl">{integration.name}</CardTitle>
          <CardDescription>
            Configure sua integração com {integration.name}
          </CardDescription>
        </div>
        <Button variant="ghost" onClick={onClose} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {integration.logo && (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={integration.logo} alt={integration.name} className="h-10 w-10 object-contain" />
            </div>
          )}
          <div className="flex-1">
            <p>{integration.description}</p>
            <div className="flex items-center mt-2">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                formData.status === 'connected' ? 'bg-green-500' : 
                formData.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {formData.status === 'connected' ? 'Conectado' : 
                formData.status === 'error' ? 'Erro na conexão' : 'Desconectado'}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium">Ativar</span>
            <Switch 
              checked={formData.enabled} 
              onCheckedChange={handleSwitchChange} 
            />
          </div>
        </div>

        <div className="space-y-4">
          {renderIntegrationSpecificFields()}
        </div>

        <div className="mt-6 space-y-2">
          <Label>Notas e Observações</Label>
          <Textarea 
            name="notes" 
            value={formData.config?.notes || ''} 
            onChange={(e) => handleConfigChange('notes', e.target.value)} 
            placeholder="Observações sobre esta integração"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            Testar Conexão
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 