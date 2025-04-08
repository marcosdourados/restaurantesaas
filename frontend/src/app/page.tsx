'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus } from 'lucide-react'
import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { getStats, incrementAndLog } from './counter'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, CheckCircle, Utensils, Users, Truck, BarChart } from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState<{ count: number; recentAccess: { accessed_at: string }[] }>({
    count: 0,
    recentAccess: []
  })
  const [optimisticStats, setOptimisticStats] = useOptimistic(stats)
  const [_, startTransition] = useTransition()
  const [activeFeature, setActiveFeature] = useState<number>(0)
  
  const features = [
    {
      title: 'Gestão Completa de Mesas',
      description: 'Organize suas mesas por áreas, controle ocupações e visualize o status em tempo real.',
      icon: <Users size={24} className="text-primary" />
    },
    {
      title: 'Pedidos Simplificados',
      description: 'Controle todo o fluxo de pedidos desde o recebimento até a entrega ou retirada.',
      icon: <Utensils size={24} className="text-primary" />
    },
    {
      title: 'Entregas Otimizadas',
      description: 'Gerencie entregas, atribua entregadores e monitore o status de cada pedido.',
      icon: <Truck size={24} className="text-primary" />
    },
    {
      title: 'Relatórios Detalhados',
      description: 'Acesse relatórios e métricas para tomar decisões baseadas em dados reais.',
      icon: <BarChart size={24} className="text-primary" />
    }
  ]

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  const handleClick = async () => {
    startTransition(async () => {
      setOptimisticStats({
        count: optimisticStats.count + 1,
        recentAccess: [{ accessed_at: new Date().toISOString() }, ...optimisticStats.recentAccess.slice(0, 4)]
      })
      const newStats = await incrementAndLog()
      setStats(newStats)
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Utensils className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">RestauranteSaaS</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-primary">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-primary">
              Planos
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-primary">
              Depoimentos
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-700 hover:text-primary">
              FAQ
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
              Entrar
            </Link>
            <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Gerencie seu restaurante de forma simples e eficiente
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Uma plataforma completa para administrar mesas, pedidos, cardápios e entregas do seu estabelecimento.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="#demo" className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 px-6 py-3 rounded-md font-medium flex items-center justify-center">
                  Ver demonstração
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">+2.500 restaurantes</p>
                  <p className="text-xs text-gray-600">confiam em nossa solução</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white shadow-xl p-4 border border-gray-200">
              <div className="relative aspect-video overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 flex flex-col items-center">
                    <Utensils size={48} />
                    <p className="mt-2">Preview do sistema</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Funcionalidades Completas</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tudo o que você precisa para gerenciar seu restaurante em um só lugar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      activeFeature === index
                        ? 'bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">{feature.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-3 bg-gray-100 rounded-xl overflow-hidden">
              <div className="h-full w-full bg-white p-4 rounded-lg shadow-lg">
                <div className="relative aspect-[16/9] bg-gray-200 rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Visualização da funcionalidade "{features[activeFeature].title}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Planos que cabem no seu bolso</h2>
            <p className="mt-4 text-lg text-gray-600">
              Escolha o plano ideal para o seu negócio. Cancele a qualquer momento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Básico</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">R$ 99</span>
                  <span className="ml-1 text-gray-600">/mês</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Ideal para pequenos estabelecimentos.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {['Até 10 mesas', 'Gestão de pedidos', 'Cardápio digital', 'Suporte por email'].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register?plan=basic" 
                  className="mt-6 block bg-white hover:bg-gray-50 text-primary border border-primary px-4 py-2 rounded text-center font-medium"
                >
                  Começar agora
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-lg border-2 border-primary shadow-lg overflow-hidden transform scale-105">
              <div className="p-6 bg-primary/5">
                <div className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                  Mais popular
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Profissional</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">R$ 199</span>
                  <span className="ml-1 text-gray-600">/mês</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Perfeito para restaurantes em crescimento.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {[
                    'Até 30 mesas', 
                    'Gestão de pedidos', 
                    'Cardápio digital', 
                    'Sistema de entregas',
                    'Relatórios e métricas',
                    'Suporte prioritário'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register?plan=pro" 
                  className="mt-6 block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-center font-medium"
                >
                  Escolher plano
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Empresarial</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">R$ 399</span>
                  <span className="ml-1 text-gray-600">/mês</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Para redes de restaurantes.
                </p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {[
                    'Mesas ilimitadas', 
                    'Múltiplas unidades', 
                    'Gestão de pedidos avançada', 
                    'Cardápio digital personalizado', 
                    'Sistema de entregas avançado',
                    'API personalizada',
                    'Suporte 24/7'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/register?plan=enterprise" 
                  className="mt-6 block bg-white hover:bg-gray-50 text-primary border border-primary px-4 py-2 rounded text-center font-medium"
                >
                  Fale conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Depoimentos de clientes</h2>
            <p className="mt-4 text-lg text-gray-600">
              Veja o que nossos clientes estão falando sobre nossa solução.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Desde que implementamos o RestauranteSaaS, a gestão do nosso restaurante ficou muito mais eficiente. Conseguimos reduzir o tempo de atendimento em 30%.",
                name: "Ana Silva",
                role: "Proprietária, Cantina Bella",
                avatar: "/avatar1.jpg"
              },
              {
                quote: "Excelente plataforma! O sistema de entregas integrado nos ajudou a expandir nosso negócio para além das paredes do restaurante.",
                name: "Carlos Mendes",
                role: "Gerente, Sabor & Arte",
                avatar: "/avatar2.jpg"
              },
              {
                quote: "O suporte ao cliente é excelente e estão sempre abertos a sugestões. A equipe é muito atenciosa e responde rapidamente.",
                name: "Marina Costa",
                role: "Chef, Bistrô Moderno",
                avatar: "/avatar3.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1">
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h2>
            <p className="mt-4 text-lg text-gray-600">
              Encontre respostas para as perguntas mais comuns sobre nosso serviço.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {[
              {
                question: "Quanto tempo leva para configurar o sistema?",
                answer: "A configuração básica leva apenas alguns minutos. Você pode começar a usar imediatamente após o cadastro. Importar seu cardápio completo e configurações avançadas pode levar algumas horas."
              },
              {
                question: "Preciso instalar algum software ou hardware?",
                answer: "Não! Nossa solução é 100% baseada na nuvem. Você só precisa de um dispositivo com acesso à internet, como computador, tablet ou smartphone."
              },
              {
                question: "Posso cancelar a assinatura a qualquer momento?",
                answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais. Seus dados ficam disponíveis por 30 dias após o cancelamento."
              },
              {
                question: "O sistema funciona offline?",
                answer: "Temos funcionalidades básicas que funcionam offline, mas para a experiência completa e sincronização de dados, é necessária conexão com a internet."
              },
              {
                question: "Oferecem suporte técnico?",
                answer: "Sim! Oferecemos suporte técnico por email para todos os planos e suporte prioritário por telefone para planos Profissional e Empresarial."
              }
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <button className="flex justify-between items-center w-full text-left focus:outline-none">
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
                <div className="mt-3">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Pronto para transformar seu restaurante?</h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Comece a usar hoje mesmo e veja a diferença na gestão do seu estabelecimento.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-block bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-md font-medium"
            >
              Começar gratuitamente
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Teste grátis por 14 dias. Sem necessidade de cartão de crédito.
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">RestauranteSaaS</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                A solução completa para a gestão do seu restaurante.
              </p>
              <div className="mt-4 flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href={`#${social}`} className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <div className="h-6 w-6 rounded-full bg-gray-700" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold">Produto</h3>
              <ul className="mt-4 space-y-2">
                {['Funcionalidades', 'Planos', 'Preços', 'Roadmap'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Suporte</h3>
              <ul className="mt-4 space-y-2">
                {['Central de Ajuda', 'Documentação', 'Tutoriais', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Empresa</h3>
              <ul className="mt-4 space-y-2">
                {['Sobre', 'Blog', 'Carreiras', 'Contato'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} RestauranteSaaS. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Termos de Serviço
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
