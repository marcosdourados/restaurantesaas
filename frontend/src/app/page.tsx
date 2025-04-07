'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUpRight, ChefHat, DollarSign, LineChart, ShoppingBag, Users } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Home() {
  // Dados simulados para o dashboard
  const [vendas] = useState(7254.75)
  const [pedidos] = useState(128)
  const [atendimentos] = useState(45)
  const [taxaOcupacao] = useState(78)
  const [peditosPendentes] = useState([
    { id: '#PED8752', mesa: '15', horario: '11:45', itens: 4, valor: 137.50, status: 'Preparando' },
    { id: '#PED8753', mesa: '7', horario: '11:52', itens: 2, valor: 68.00, status: 'Aguardando' },
    { id: '#PED8754', mesa: '3', horario: '12:03', itens: 3, valor: 94.75, status: 'Pronto' },
    { id: '#PED8755', mesa: '9', horario: '12:10', itens: 1, valor: 32.90, status: 'Aguardando' },
    { id: '#PED8756', mesa: '11', horario: '12:15', itens: 5, valor: 178.50, status: 'Preparando' },
  ])
  
  // Dados dos produtos mais vendidos
  const [produtosMaisVendidos] = useState([
    { nome: 'Picanha ao Ponto', quantidade: 36, percentual: 14 },
    { nome: 'Camarão Internacional', quantidade: 28, percentual: 11 },
    { nome: 'Bobó de Camarão', quantidade: 24, percentual: 9 },
    { nome: 'Filé à Parmegiana', quantidade: 22, percentual: 8 },
    { nome: 'Refrigerante 600ml', quantidade: 67, percentual: 26 },
  ])

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            RestaurantSaaS
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-700" asChild>
            <a href="#" className="font-medium">
              <LineChart className="h-5 w-5" />
              Dashboard
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-700" asChild>
            <a href="#" className="font-medium">
              <Users className="h-5 w-5" />
              Mesas
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-700" asChild>
            <a href="#" className="font-medium">
              <ChefHat className="h-5 w-5" />
              Cardápio
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-700" asChild>
            <a href="#" className="font-medium">
              <ShoppingBag className="h-5 w-5" />
              Pedidos
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-700" asChild>
            <a href="#" className="font-medium">
              <DollarSign className="h-5 w-5" />
              Financeiro
            </a>
          </Button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/avatars/chef.jpg" alt="Chef Silva" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Chef Silva</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Bem-vindo de volta, veja as principais métricas do seu restaurante.</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Vendas Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">R$ {vendas.toFixed(2)}</div>
                <div className="p-2 bg-green-100 text-green-700 rounded-full">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-1">+12% comparado a ontem</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{pedidos}</div>
                <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-1">+5% comparado a ontem</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{atendimentos}</div>
                <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-purple-600 mt-1">+8% comparado a ontem</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Taxa de Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold">{taxaOcupacao}%</div>
                <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                  <ChefHat className="h-4 w-4" />
                </div>
              </div>
              <Progress value={taxaOcupacao} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs com pedidos e produtos mais vendidos */}
        <Tabs defaultValue="pedidos">
          <TabsList className="mb-4">
            <TabsTrigger value="pedidos">Pedidos Pendentes</TabsTrigger>
            <TabsTrigger value="produtos">Produtos Mais Vendidos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Pendentes</CardTitle>
                <CardDescription>
                  Gerencie os pedidos pendentes do seu restaurante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {peditosPendentes.map((pedido) => (
                      <div key={pedido.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">{pedido.id}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Mesa {pedido.mesa} • {pedido.horario}</div>
                          <div className="text-sm">{pedido.itens} itens • R$ {pedido.valor.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            pedido.status === 'Preparando' 
                              ? 'bg-amber-100 text-amber-700' 
                              : pedido.status === 'Pronto' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {pedido.status}
                          </div>
                          <Button variant="outline" size="sm">Ver</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="produtos">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Os produtos mais populares do seu restaurante hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-6">
                    {produtosMaisVendidos.map((produto, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{produto.nome}</span>
                          <span className="text-gray-500 dark:text-gray-400">{produto.quantidade} unid.</span>
                        </div>
                        <Progress value={produto.percentual} className="h-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
