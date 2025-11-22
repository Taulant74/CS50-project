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
  transmission?: string;
  color?: string;
  shortDescription?: string;
  description?: string;
  imageUrls?: string; // comma-separated URLs, we'll split in frontend
  createdAt: string;
  branch?: Branch | null;
}

export interface Inquiry {
  id?: number;
  vehicleId: number;
  userId?: number | null;
  name: string;
  email: string;
  message: string;
  status?: string;
  createdAt?: string;
}

export interface TestDrive {
  id?: number;
  vehicleId: number;
  userId: number;
  preferredDate: string; // "2025-11-22"
  preferredTime: string; // "14:30:00"
  status?: string;
  notes?: string;
  createdAt?: string;
}

export interface Favorite {
  userId: number;
  vehicleId: number;
  createdAt?: string;
}
