export interface Partner {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  partnerId: string;
  name: string;
  location: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubBrand {
  id: string;
  brandId: string;
  name: string;
  location: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableConfig {
  id: string;
  subBrandId: string;
  tableNumber: string;
  chairCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  entity: string;
  entityName: string;
  timestamp: string;
}
