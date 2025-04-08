'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  UtensilsCrossed, 
  BookOpen, 
  Users, 
  Truck, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/tables', label: 'Mesas', icon: Users },
    { href: '/dashboard/orders', label: 'Pedidos', icon: UtensilsCrossed },
    { href: '/dashboard/menu', label: 'Cardápio', icon: BookOpen },
    { href: '/dashboard/deliveries', label: 'Entregas', icon: Truck },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-primary text-white rounded-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">RestauranteSaaS</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-3 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-r-4 border-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3" size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 