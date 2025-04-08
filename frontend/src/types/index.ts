export interface LoginCredentials {
  email: string;
  password: string;
  restaurantId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  restaurantId: string;
  role: {
    id: string;
    name: string;
    permissions: any;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  restaurantId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerId: string;
  address: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  courierId?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
} 