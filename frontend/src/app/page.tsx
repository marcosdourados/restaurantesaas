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
import { ApiService } from '@/lib/api'

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState<{ status?: string; message?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/api/health')
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setApiStatus(data)
        setError(null)
      } catch (err) {
        setError('Não foi possível conectar ao servidor backend.')
        setApiStatus(null)
      } finally {
        setLoading(false)
      }
    }

    checkApiStatus()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sistema RestauranteSaaS</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Status do Backend:</h2>
          
          {loading && (
            <div className="text-center p-4">
              <p>Verificando conexão com o backend...</p>
            </div>
          )}
          
          {!loading && error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {!loading && apiStatus && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <p><strong>Status:</strong> {apiStatus.status}</p>
              <p><strong>Mensagem:</strong> {apiStatus.message}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center">
            Entrar no Sistema
          </Link>
          
          <Link href="/register" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-center">
            Registrar Nova Conta
          </Link>
        </div>
      </div>
    </div>
  )
}
