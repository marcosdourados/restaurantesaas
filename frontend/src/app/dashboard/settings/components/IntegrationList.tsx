'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Globe, ExternalLink } from 'lucide-react';
import IntegrationDetails from './IntegrationDetails';

// Tipos
type Integration = {
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

export default function IntegrationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  
  // Lista de integrações disponíveis (mockada)
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google_maps',
      name: 'Google Maps',
      description: 'Integre com o Google Maps para localização e rotas.',
      logo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
      enabled: true,
      apiKey: '',
      status: 'disconnected',
      config: {
        zoom: '14',
        mapType: 'roadmap'
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Conecte sua página do Facebook para compartilhamento de conteúdo.',
      logo: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
      enabled: false,
      apiKey: '',
      status: 'disconnected',
      config: {
        pageId: '',
        shareProducts: 'false',
        sharePromotions: 'false'
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Conecte seu Instagram para exibir fotos no site.',
      logo: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
      enabled: true,
      apiKey: '',
      status: 'connected',
      config: {
        pageId: '12345678',
        shareProducts: 'true',
        sharePromotions: 'true'
      }
    },
    {
      id: 'ifood',
      name: 'iFood',
      description: 'Integre com o iFood para sincronizar pedidos.',
      logo: 'https://play-lh.googleusercontent.com/kZ-1yCHCUeTXR9aXbRFpWUhjmJY-BsgQiHMjT8Jbs37hQFT4TgpR3ar0L-JWyB-fqhvH',
      enabled: true,
      apiKey: '********',
      webhookUrl: 'https://api.restaurantesaas.com/webhooks/ifood',
      status: 'connected',
      config: {
        autoAccept: 'false'
      }
    },
    {
      id: 'rappi',
      name: 'Rappi',
      description: 'Integre com o Rappi para sincronizar pedidos.',
      logo: 'https://play-lh.googleusercontent.com/QnP2TxXG6fR8Cz0X4MKpzGT2RgVuMbYu0Q7VR1aJZv6UmRH3UdQnldjEQXtVbZN2DQ',
      enabled: false,
      apiKey: '',
      status: 'disconnected'
    }
  ]);

  // Filtra as integrações com base no termo de busca
  const filteredIntegrations = integrations.filter(integration => 
    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para visualizar detalhes da integração
  const viewIntegrationDetails = (integration: Integration) => {
    setSelectedIntegration(integration);
  };

  // Função para alternar o estado de ativação da integração
  const toggleIntegrationEnabled = (id: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id ? { ...integration, enabled } : integration
      )
    );
  };

  // Função para salvar alterações da integração
  const saveIntegration = (updatedIntegration: Integration) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === updatedIntegration.id ? updatedIntegration : integration
      )
    );
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e busca */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Integrações Disponíveis</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar integração..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de integrações */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={integration.logo} 
                        alt={integration.name} 
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{integration.name}</h3>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          integration.status === 'connected' ? 'bg-green-500' : 
                          integration.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-muted-foreground">
                          {integration.status === 'connected' ? 'Conectado' : 
                           integration.status === 'error' ? 'Erro' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={integration.enabled} 
                    onCheckedChange={(checked) => toggleIntegrationEnabled(integration.id, checked)} 
                  />
                </div>

                <p className="text-sm text-muted-foreground mt-3 flex-grow">
                  {integration.description}
                </p>

                <div className="flex items-center justify-end mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => viewIntegrationDetails(integration)}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Configurar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-7 w-7"
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de detalhes da integração */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <IntegrationDetails 
            integration={selectedIntegration} 
            onClose={() => setSelectedIntegration(null)}
            onSave={saveIntegration}
          />
        </div>
      )}
    </div>
  );
} 