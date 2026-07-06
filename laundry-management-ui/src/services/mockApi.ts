import { MockDatabase } from "../data/mockDb";
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

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Organizations
  organizations: {
    list: async (): Promise<Organization[]> => {
      await delay();
      return MockDatabase.getOrganizations();
    },
    create: async (org: Omit<Organization, "id" | "createdAt">): Promise<Organization> => {
      await delay();
      const list = MockDatabase.getOrganizations();
      const newOrg: Organization = {
        ...org,
        id: list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveOrganizations([...list, newOrg]);
      return newOrg;
    },
    update: async (org: Organization): Promise<Organization> => {
      await delay();
      const list = MockDatabase.getOrganizations();
      const updatedList = list.map((o) => (o.id === org.id ? org : o));
      MockDatabase.saveOrganizations(updatedList);
      return org;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getOrganizations();
      MockDatabase.saveOrganizations(list.filter((o) => o.id !== id));
    },
  },

  // Roles
  roles: {
    list: async (): Promise<Role[]> => {
      await delay();
      return MockDatabase.getRoles();
    },
    create: async (role: Omit<Role, "id">): Promise<Role> => {
      await delay();
      const list = MockDatabase.getRoles();
      const newRole: Role = {
        ...role,
        id: list.length > 0 ? Math.max(...list.map((r) => r.id)) + 1 : 1,
      };
      MockDatabase.saveRoles([...list, newRole]);
      return newRole;
    },
    update: async (role: Role): Promise<Role> => {
      await delay();
      const list = MockDatabase.getRoles();
      const updatedList = list.map((r) => (r.id === role.id ? role : r));
      MockDatabase.saveRoles(updatedList);
      return role;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getRoles();
      MockDatabase.saveRoles(list.filter((r) => r.id !== id));
    },
  },

  // Users
  users: {
    list: async (): Promise<User[]> => {
      await delay();
      return MockDatabase.getUsers();
    },
    create: async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
      await delay();
      const list = MockDatabase.getUsers();
      const newUser: User = {
        ...user,
        id: list.length > 0 ? Math.max(...list.map((u) => u.id)) + 1 : 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveUsers([...list, newUser]);
      return newUser;
    },
    update: async (user: User): Promise<User> => {
      await delay();
      const list = MockDatabase.getUsers();
      const updatedList = list.map((u) => (u.id === user.id ? user : u));
      MockDatabase.saveUsers(updatedList);
      return user;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getUsers();
      MockDatabase.saveUsers(list.filter((u) => u.id !== id));
    },
  },

  // Shops
  shops: {
    list: async (): Promise<LaundryShop[]> => {
      await delay();
      return MockDatabase.getShops();
    },
    create: async (shop: Omit<LaundryShop, "id" | "createdAt">): Promise<LaundryShop> => {
      await delay();
      const list = MockDatabase.getShops();
      const newShop: LaundryShop = {
        ...shop,
        id: list.length > 0 ? Math.max(...list.map((s) => s.id)) + 1 : 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveShops([...list, newShop]);
      return newShop;
    },
    update: async (shop: LaundryShop): Promise<LaundryShop> => {
      await delay();
      const list = MockDatabase.getShops();
      const updatedList = list.map((s) => (s.id === shop.id ? shop : s));
      MockDatabase.saveShops(updatedList);
      return shop;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getShops();
      MockDatabase.saveShops(list.filter((s) => s.id !== id));
    },
  },

  // Services
  services: {
    list: async (): Promise<Service[]> => {
      await delay();
      return MockDatabase.getServices();
    },
    create: async (svc: Omit<Service, "id">): Promise<Service> => {
      await delay();
      const list = MockDatabase.getServices();
      const newSvc: Service = {
        ...svc,
        id: list.length > 0 ? Math.max(...list.map((s) => s.id)) + 1 : 1,
      };
      MockDatabase.saveServices([...list, newSvc]);
      return newSvc;
    },
    update: async (svc: Service): Promise<Service> => {
      await delay();
      const list = MockDatabase.getServices();
      const updatedList = list.map((s) => (s.id === svc.id ? svc : s));
      MockDatabase.saveServices(updatedList);
      return svc;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getServices();
      MockDatabase.saveServices(list.filter((s) => s.id !== id));
    },
  },

  // Orders
  orders: {
    list: async (): Promise<Order[]> => {
      await delay();
      return MockDatabase.getOrders();
    },
    create: async (order: Omit<Order, "id" | "orderNumber" | "createdAt">): Promise<Order> => {
      await delay();
      const list = MockDatabase.getOrders();
      const orderNum = `ORD-${String(list.length + 1).padStart(3, "0")}`;
      const newOrder: Order = {
        ...order,
        id: list.length > 0 ? Math.max(...list.map((o) => o.id)) + 1 : 1,
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
      };
      MockDatabase.saveOrders([...list, newOrder]);

      // Create a pending payment automatically
      const payments = MockDatabase.getPayments();
      const newPayment: Payment = {
        id: payments.length > 0 ? Math.max(...payments.map((p) => p.id)) + 1 : 1,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        amount: newOrder.totalAmount,
        method: "Cash",
        status: "Pending",
        referenceId: "TXN-PENDING",
        transactionDate: newOrder.createdAt,
      };
      MockDatabase.savePayments([...payments, newPayment]);

      return newOrder;
    },
    update: async (order: Order): Promise<Order> => {
      await delay();
      const list = MockDatabase.getOrders();
      const updatedList = list.map((o) => (o.id === order.id ? order : o));
      MockDatabase.saveOrders(updatedList);
      return order;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      const list = MockDatabase.getOrders();
      MockDatabase.saveOrders(list.filter((o) => o.id !== id));
    },
  },

  // Payments
  payments: {
    list: async (): Promise<Payment[]> => {
      await delay();
      return MockDatabase.getPayments();
    },
    updateStatus: async (id: number, status: "Completed" | "Failed", method: any, referenceId: string): Promise<Payment> => {
      await delay();
      const list = MockDatabase.getPayments();
      const target = list.find((p) => p.id === id);
      if (!target) throw new Error("Payment not found");
      target.status = status;
      target.method = method;
      target.referenceId = referenceId;
      target.transactionDate = new Date().toISOString();
      MockDatabase.savePayments(list.map((p) => (p.id === id ? target : p)));
      return target;
    },
  },

  // Partners
  partners: {
    list: async (): Promise<Partner[]> => {
      await delay();
      return MockDatabase.getPartners();
    },
    update: async (partner: Partner): Promise<Partner> => {
      await delay();
      const list = MockDatabase.getPartners();
      const updatedList = list.map((p) => (p.id === partner.id ? partner : p));
      MockDatabase.savePartners(updatedList);
      return partner;
    },
  },

  // Ratings
  ratings: {
    list: async (): Promise<Rating[]> => {
      await delay();
      return MockDatabase.getRatings();
    },
    create: async (rating: Omit<Rating, "id" | "date">): Promise<Rating> => {
      await delay();
      const list = MockDatabase.getRatings();
      const newRating: Rating = {
        ...rating,
        id: list.length > 0 ? Math.max(...list.map((r) => r.id)) + 1 : 1,
        date: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveRatings([...list, newRating]);
      return newRating;
    },
  },

  // Complaints
  complaints: {
    list: async (): Promise<Complaint[]> => {
      await delay();
      return MockDatabase.getComplaints();
    },
    create: async (complaint: Omit<Complaint, "id" | "status" | "date">): Promise<Complaint> => {
      await delay();
      const list = MockDatabase.getComplaints();
      const newComplaint: Complaint = {
        ...complaint,
        id: list.length > 0 ? Math.max(...list.map((c) => c.id)) + 1 : 1,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveComplaints([...list, newComplaint]);
      return newComplaint;
    },
    resolve: async (id: number, resolution: string): Promise<Complaint> => {
      await delay();
      const list = MockDatabase.getComplaints();
      const complaint = list.find((c) => c.id === id);
      if (!complaint) throw new Error("Complaint not found");
      complaint.status = "resolved";
      complaint.resolution = resolution;
      MockDatabase.saveComplaints(list.map((c) => (c.id === id ? complaint : c)));
      return complaint;
    },
  },

  // Notifications
  notifications: {
    list: async (): Promise<Notification[]> => {
      await delay();
      return MockDatabase.getNotifications();
    },
    create: async (notification: Omit<Notification, "id" | "date">): Promise<Notification> => {
      await delay();
      const list = MockDatabase.getNotifications();
      const newNotification: Notification = {
        ...notification,
        id: list.length > 0 ? Math.max(...list.map((n) => n.id)) + 1 : 1,
        date: new Date().toISOString().split("T")[0],
      };
      MockDatabase.saveNotifications([...list, newNotification]);
      return newNotification;
    },
  },
};
