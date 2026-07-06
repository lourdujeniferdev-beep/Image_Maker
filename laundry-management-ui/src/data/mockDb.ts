import type {
  Organization,
  Role,
  User,
  LaundryShop,
  Service,
  Order,
  Payment,
  Partner,
  Rating,
  Complaint,
  Notification,
} from "../types";

// Helper to initialize local storage
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(item);
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Mock Data
const initialOrganizations: Organization[] = [
  {
    id: 1,
    organizationName: "Fresh Laundry Co.",
    email: "contact@freshlaundry.com",
    phone: "9876543210",
    address: "123 Main St, New York, NY",
    status: true,
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    organizationName: "Clean Express Inc.",
    email: "support@cleanexpress.com",
    phone: "9876543211",
    address: "456 Broadway, Boston, MA",
    status: true,
    createdAt: "2026-02-15",
  },
];

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system administration with unrestricted dashboard management rights.",
    permissions: {
      organizations: { view: true, create: true, edit: true, delete: true },
      roles: { view: true, create: true, edit: true, delete: true },
      users: { view: true, create: true, edit: true, delete: true },
      shops: { view: true, create: true, edit: true, delete: true },
      services: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, delete: true },
      payments: { view: true, create: true, edit: true, delete: true },
      complaints: { view: true, create: true, edit: true, delete: true },
      notifications: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    id: 2,
    name: "Shop Manager",
    description: "Manage orders, laundry services, and local pricing details.",
    permissions: {
      organizations: { view: true, create: false, edit: false, delete: false },
      roles: { view: true, create: false, edit: false, delete: false },
      users: { view: true, create: false, edit: false, delete: false },
      shops: { view: true, create: false, edit: true, delete: false },
      services: { view: true, create: true, edit: true, delete: true },
      orders: { view: true, create: true, edit: true, delete: false },
      payments: { view: true, create: false, edit: false, delete: false },
      complaints: { view: true, create: false, edit: true, delete: false },
      notifications: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
    },
  },
];

const initialUsers: User[] = [
  {
    id: 1,
    username: "admin",
    fullname: "Admin User",
    email: "admin@laundryerp.com",
    mobile: "9998887770",
    role: "Super Admin",
    status: true,
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    username: "john_owner",
    fullname: "John Doe",
    email: "john@cleanexpress.com",
    mobile: "9876543212",
    role: "Shop Manager",
    status: true,
    createdAt: "2026-02-16",
  },
];

const initialShops: LaundryShop[] = [
  {
    id: 1,
    name: "Fresh Laundry - Manhattan",
    ownerName: "Fresh Laundry Co.",
    email: "manhattan@freshlaundry.com",
    phone: "212-555-0199",
    address: "123 Main St, New York, NY",
    status: true,
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Clean Express - Downtown",
    ownerName: "Clean Express Inc.",
    email: "downtown@cleanexpress.com",
    phone: "617-555-0143",
    address: "456 Broadway, Boston, MA",
    status: true,
    createdAt: "2026-02-15",
  },
];

const initialServices: Service[] = [
  {
    id: 1,
    name: "Wash & Fold (Standard)",
    category: "Wash & Fold",
    price: 2.5,
    description: "Standard washing, tumble drying, and neat folding per lb.",
    status: true,
  },
  {
    id: 2,
    name: "Dry Cleaning (Suit)",
    category: "Dry Clean",
    price: 15.0,
    description: "Professional dry cleaning for standard 2-piece suits.",
    status: true,
  },
  {
    id: 3,
    name: "Premium Wash & Steam Iron",
    category: "Ironing",
    price: 4.0,
    description: "Delicate washing, hung dry, and steam ironed to perfection.",
    status: true,
  },
  {
    id: 4,
    name: "Duvet / Blanket Wash",
    category: "Heavy Wash",
    price: 12.5,
    description: "Deep sanitary wash for heavy blankets, comforters, and duvets.",
    status: true,
  },
];

const initialOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "Alice Vance",
    customerPhone: "9876540001",
    shopId: 1,
    shopName: "Fresh Laundry - Manhattan",
    services: [
      { serviceId: 1, name: "Wash & Fold (Standard)", quantity: 5, price: 2.5 },
      { serviceId: 2, name: "Dry Cleaning (Suit)", quantity: 1, price: 15.0 },
    ],
    totalAmount: 27.5,
    status: "Delivered",
    pickupPartnerId: 1,
    pickupPartnerName: "Dave Miller",
    deliveryPartnerId: 2,
    deliveryPartnerName: "Sarah Connor",
    createdAt: "2026-06-20T10:00:00.000Z",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerName: "Bob Smith",
    customerPhone: "9876540002",
    shopId: 1,
    shopName: "Fresh Laundry - Manhattan",
    services: [
      { serviceId: 3, name: "Premium Wash & Steam Iron", quantity: 3, price: 4.0 },
    ],
    totalAmount: 12.0,
    status: "Washing In Progress",
    pickupPartnerId: 1,
    pickupPartnerName: "Dave Miller",
    createdAt: "2026-06-22T14:30:00.000Z",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerName: "Charlie Brown",
    customerPhone: "9876540003",
    shopId: 2,
    shopName: "Clean Express - Downtown",
    services: [
      { serviceId: 4, name: "Duvet / Blanket Wash", quantity: 2, price: 12.5 },
    ],
    totalAmount: 25.0,
    status: "Created",
    createdAt: "2026-06-23T08:15:00.000Z",
  },
];

const initialPayments: Payment[] = [
  {
    id: 1,
    orderId: 1,
    orderNumber: "ORD-001",
    customerName: "Alice Vance",
    amount: 27.5,
    method: "UPI",
    status: "Completed",
    referenceId: "TXN12345678",
    transactionDate: "2026-06-20T10:15:00.000Z",
  },
  {
    id: 2,
    orderId: 2,
    orderNumber: "ORD-002",
    customerName: "Bob Smith",
    amount: 12.0,
    method: "Cash",
    status: "Pending",
    referenceId: "TXN-PENDING",
    transactionDate: "2026-06-22T14:30:00.000Z",
  },
];

const initialPartners: Partner[] = [
  {
    id: 1,
    name: "Dave Miller",
    phone: "9876543213",
    email: "dave@pickup.com",
    type: "pickup",
    status: "available",
    rating: 4.8,
    completionRate: 98,
    assignedOrdersCount: 2,
  },
  {
    id: 2,
    name: "Sarah Connor",
    phone: "9876543214",
    email: "sarah@delivery.com",
    type: "delivery",
    status: "busy",
    rating: 4.9,
    completionRate: 100,
    assignedOrdersCount: 1,
  },
];

const initialRatings: Rating[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerName: "Alice Vance",
    rating: 5,
    comment: "Amazing laundry service! Clothes smelled fresh and standard of folding is top notch.",
    date: "2026-06-21",
  },
];

const initialComplaints: Complaint[] = [
  {
    id: 1,
    orderNumber: "ORD-002",
    customerName: "Bob Smith",
    issue: "Late pickup assignment; pickup partner delayed by 2 hours.",
    priority: "medium",
    status: "pending",
    date: "2026-06-22",
  },
];

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "System Maintenance Update",
    message: "The Laundry Management dashboard will be undergoing scheduled upgrades tonight between 01:00 AM - 03:00 AM EST.",
    recipientGroup: "all",
    date: "2026-06-23",
  },
];

// Mock Database Class
export class MockDatabase {
  static getOrganizations() {
    return getStorageItem("organizations", initialOrganizations);
  }
  static saveOrganizations(data: Organization[]) {
    setStorageItem("organizations", data);
  }

  static getRoles() {
    return getStorageItem("roles", initialRoles);
  }
  static saveRoles(data: Role[]) {
    setStorageItem("roles", data);
  }

  static getUsers() {
    return getStorageItem("users", initialUsers);
  }
  static saveUsers(data: User[]) {
    setStorageItem("users", data);
  }

  static getShops() {
    return getStorageItem("shops", initialShops);
  }
  static saveShops(data: LaundryShop[]) {
    setStorageItem("shops", data);
  }

  static getServices() {
    return getStorageItem("services", initialServices);
  }
  static saveServices(data: Service[]) {
    setStorageItem("services", data);
  }

  static getOrders() {
    return getStorageItem("orders", initialOrders);
  }
  static saveOrders(data: Order[]) {
    setStorageItem("orders", data);
  }

  static getPayments() {
    return getStorageItem("payments", initialPayments);
  }
  static savePayments(data: Payment[]) {
    setStorageItem("payments", data);
  }

  static getPartners() {
    return getStorageItem("partners", initialPartners);
  }
  static savePartners(data: Partner[]) {
    setStorageItem("partners", data);
  }

  static getRatings() {
    return getStorageItem("ratings", initialRatings);
  }
  static saveRatings(data: Rating[]) {
    setStorageItem("ratings", data);
  }

  static getComplaints() {
    return getStorageItem("complaints", initialComplaints);
  }
  static saveComplaints(data: Complaint[]) {
    setStorageItem("complaints", data);
  }

  static getNotifications() {
    return getStorageItem("notifications", initialNotifications);
  }
  static saveNotifications(data: Notification[]) {
    setStorageItem("notifications", data);
  }
}
