export interface Organization {
  id: number;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  createdAt: string;
}

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, Permission>;
}

export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  mobile: string;
  role: string;
  status: boolean;
  createdAt: string;
}

export interface LaundryShop {
  id: number;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  status: boolean;
}

export interface OrderItem {
  serviceId: number;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "Created"
  | "Pickup Assigned"
  | "Clothes Collected"
  | "Washing In Progress"
  | "Ready For Delivery"
  | "Delivery Assigned"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shopId: number;
  shopName: string;
  services: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  pickupPartnerId?: number;
  pickupPartnerName?: string;
  deliveryPartnerId?: number;
  deliveryPartnerName?: string;
  createdAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: "Cash" | "Card" | "UPI" | "NetBanking";
  status: "Pending" | "Completed" | "Failed";
  referenceId: string;
  transactionDate: string;
}

export interface Partner {
  id: number;
  name: string;
  phone: string;
  email: string;
  type: "pickup" | "delivery";
  status: "available" | "busy" | "offline";
  rating: number;
  completionRate: number;
  assignedOrdersCount: number;
}

export interface Rating {
  id: number;
  orderNumber: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: number;
  orderNumber: string;
  customerName: string;
  issue: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "resolved";
  date: string;
  resolution?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  recipientGroup: "all" | "customers" | "partners" | "shops";
  date: string;
}
