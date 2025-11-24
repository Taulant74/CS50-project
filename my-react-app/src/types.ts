// src/types.ts

export interface Branch {
  id: number;
  name: string;
  city: string;
  address: string;
  phone?: string;
}

export interface Vehicle {
  id: number;
  branchId?: number | null;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string;
  transmission?: string | null;
  color?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  imageUrls?: string | null;
  createdAt: string;
  branch?: Branch | null;
}

export interface Inquiry {
  id: number;
  vehicleId: number;
  userId?: number | null;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface TestDrive {
  id: number;
  vehicleId: number;
  userId: number;
  preferredDate: string;
  preferredTime: string;
  status: string;
  notes?: string | null;
  createdAt: string;
}
