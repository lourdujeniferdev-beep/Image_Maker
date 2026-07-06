import { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaClock,
  FaMoneyBillWave,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { mockApi } from "../services/mockApi";
import type { Order } from "../types";

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.orders.list().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;
  const revenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const distinctCustomers = new Set(orders.map((o) => o.customerName)).size;

  // Chart Data: Revenue Trend
  const chartData = [
    { name: "Mon", Revenue: 4000, Orders: 24 },
    { name: "Tue", Revenue: 3000, Orders: 18 },
    { name: "Wed", Revenue: 2000, Orders: 20 },
    { name: "Thu", Revenue: 2780, Orders: 15 },
    { name: "Fri", Revenue: 1890, Orders: 10 },
    { name: "Sat", Revenue: 2390, Orders: 12 },
    { name: "Sun", Revenue: 3490, Orders: 21 },
  ];

  // Chart Data: Status Breakdown
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#3b82f6", // Blue
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#ef4444", // Red
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-semibold text-slate-500">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1.5 opacity-90 text-sm md:text-base">
            System overview and operations statistics summary.
          </p>
        </div>
        <Link
          to="/orders/create"
          className="bg-white text-blue-600 hover:bg-slate-50 font-bold px-5 py-3 rounded-xl transition shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
        >
          + Create New Order
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {totalOrders}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FaShoppingBag size={22} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Orders
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {pendingOrders}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FaClock size={22} />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Revenue
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
              ₹{revenue.toLocaleString()}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FaMoneyBillWave size={22} />
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Customers
            </span>
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
              {distinctCustomers}
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <FaUsers size={22} />
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Weekly Revenue Trend
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Order Status Breakdown
          </h3>
          <div className="flex-1 min-h-[250px] relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
                No orders data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Recent Activity Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Showing the latest laundry service transactions.
            </p>
          </div>
          <Link
            to="/orders"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
          >
            <span>View All Orders</span>
            <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Laundry Shop</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => {
                const statusStyles: Record<string, string> = {
                  Created: "bg-blue-50 text-blue-700 border-blue-200",
                  "Pickup Assigned": "bg-indigo-50 text-indigo-700 border-indigo-200",
                  "Clothes Collected": "bg-amber-50 text-amber-700 border-amber-200",
                  "Washing In Progress": "bg-purple-50 text-purple-700 border-purple-200",
                  "Ready For Delivery": "bg-cyan-50 text-cyan-700 border-cyan-200",
                  "Delivery Assigned": "bg-teal-50 text-teal-700 border-teal-200",
                  Delivered: "bg-green-50 text-green-700 border-green-200",
                  Cancelled: "bg-red-50 text-red-700 border-red-200",
                };

                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4">{order.shopName}</td>
                    <td className="px-6 py-4 font-bold">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          statusStyles[order.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}