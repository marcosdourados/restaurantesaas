'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DownloadIcon, BarChart3, PieChart, LineChart, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

// Componente para simular um gráfico
function ChartPlaceholder({ title, type, height = 300 }: { title: string; type: string; height?: number }) {
  return (
    <div 
      className="w-full rounded-md bg-gray-100 flex flex-col items-center justify-center p-4"
      style={{ height: `${height}px` }}
    >
      {type === 'bar' && <BarChart3 className="h-16 w-16 text-gray-400 mb-2" />}
      {type === 'pie' && <PieChart className="h-16 w-16 text-gray-400 mb-2" />}
      {type === 'line' && <LineChart className="h-16 w-16 text-gray-400 mb-2" />}
      <p className="text-gray-500 font-medium">{title}</p>
      <p className="text-gray-400 text-sm">Os dados serão exibidos aqui</p>
    </div>
  );
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('vendas');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: new Date(new Date().setDate(new Date().getDate() - 30)), 
    to: new Date() 
  });
  const [reportType, setReportType] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dados simulados para os cards
  const [summaryData, setSummaryData] = useState({
    totalVendas: 0,
    ticketMedio: 0,
    totalPedidos: 0,
    clientesNovos: 0
  });
  
  // Simulando carregamento de dados
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setSummaryData({
        totalVendas: Math.floor(Math.random() * 50000) + 10000,
        ticketMedio: Math.floor(Math.random() * 100) + 50,
        totalPedidos: Math.floor(Math.random() * 500) + 100,
        clientesNovos: Math.floor(Math.random() * 100) + 20
      });
      
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [dateRange, reportType]);
  
  // Formata valores para exibição
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Relatórios e Estatísticas</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="flex-grow-0">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="flex items-center gap-2" variant="outline">
          <DownloadIcon size={16} />
          Exportar PDF
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={isLoading ? "animate-pulse" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total de Vendas</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "--" : formatCurrency(summaryData.totalVendas)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+12.5% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={isLoading ? "animate-pulse" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "--" : formatCurrency(summaryData.ticketMedio)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+5.2% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={isLoading ? "animate-pulse" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total de Pedidos</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "--" : summaryData.totalPedidos}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+8.7% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={isLoading ? "animate-pulse" : ""}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Novos Clientes</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "--" : summaryData.clientesNovos}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+3.1% em relação ao período anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendas">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendas por Período</CardTitle>
                <CardDescription>
                  Total de vendas ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Vendas por Período" type="line" height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
                <CardDescription>
                  Distribuição de vendas por categoria de produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Vendas por Categoria" type="pie" height={300} />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Desempenho de Vendas por Hora</CardTitle>
                <CardDescription>
                  Análise de vendas por horário do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Vendas por Hora" type="bar" height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="produtos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Ranking dos produtos com maior volume de vendas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Produtos Mais Vendidos" type="bar" height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produtos por Receita</CardTitle>
                <CardDescription>
                  Ranking dos produtos com maior receita gerada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Produtos por Receita" type="bar" height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produtos por Rentabilidade</CardTitle>
                <CardDescription>
                  Análise de margem de lucro por produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Rentabilidade" type="bar" height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Produtos</CardTitle>
                <CardDescription>
                  Análise de crescimento de vendas de produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Tendência de Produtos" type="line" height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clientes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Novos Clientes</CardTitle>
                <CardDescription>
                  Evolução de novos clientes ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Novos Clientes" type="line" height={300} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Região</CardTitle>
                <CardDescription>
                  Distribuição geográfica de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Clientes por Região" type="pie" height={300} />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Frequência de Compra</CardTitle>
                <CardDescription>
                  Análise de frequência de compras por cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder title="Gráfico de Frequência de Compra" type="bar" height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 