import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"revenue" | "orders" | "customers" | "services">("revenue");

  // Export animation states
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = (type: "pdf" | "excel") => {
    setExporting(type);
    setToastMsg("");
    setTimeout(() => {
      setExporting(null);
      setToastMsg(`Report exported to ${type.toUpperCase()} successfully!`);
      setTimeout(() => setToastMsg(""), 3500);
    }, 1500);
  };

  // Calculations for Reports
  const revenueData = [
    { name: "Week 21", Revenue: 25000 },
    { name: "Week 22", Revenue: 42000 },
    { name: "Week 23", Revenue: 52000 },
    { name: "Week 24", Revenue: 38000 },
  ];

  const ordersData = [
    { name: "Wash & Fold", count: 48 },
    { name: "Dry Clean", count: 32 },
    { name: "Ironing", count: 25 },
    { name: "Heavy Wash", count: 12 },
  ];

  const customersData = [
    { name: "Jan", count: 120 },
    { name: "Feb", count: 210 },
    { name: "Mar", count: 310 },
    { name: "Apr", count: 420 },
  ];

  const servicesData = [
    { name: "Standard Wash", volume: 150 },
    { name: "Premium Wash", volume: 90 },
    { name: "Heavy Duvet", volume: 45 },
    { name: "Suits Clean", volume: 60 },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-semibold text-slate-500">Loading Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Reports & Analytics" }]} />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl border border-slate-800 shadow-2xl animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">
            Inspect cash settlement statements, growth ratios, and catalog service distributions.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExport("pdf")}
            disabled={!!exporting}
            className="flex-1 sm:flex-none border hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FaFilePdf className="text-red-500" />
            <span>{exporting === "pdf" ? "Exporting..." : "Download PDF"}</span>
          </button>
          <button
            onClick={() => handleExport("excel")}
            disabled={!!exporting}
            className="flex-1 sm:flex-none border hover:bg-slate-50 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FaFileExcel className="text-green-600" />
            <span>{exporting === "excel" ? "Exporting..." : "Download Excel"}</span>
          </button>
        </div>
      </div>

      {/* Report Type selector tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex-1 py-4 text-center font-bold text-sm transition focus:outline-none cursor-pointer ${
              activeTab === "revenue"
                ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Revenue Report
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-4 text-center font-bold text-sm transition focus:outline-none cursor-pointer ${
              activeTab === "orders"
                ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Orders Report
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`flex-1 py-4 text-center font-bold text-sm transition focus:outline-none cursor-pointer ${
              activeTab === "customers"
                ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Customer Growth
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex-1 py-4 text-center font-bold text-sm transition focus:outline-none cursor-pointer ${
              activeTab === "services"
                ? "bg-slate-50 text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Service Demands
          </button>
        </div>

        {/* Tab Contents widgets */}
        <div className="p-6">
          {activeTab === "revenue" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <FaChartBar /> Weekly Billing Revenue
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FaCalendarAlt /> Jun 2026
                </span>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <FaChartBar /> Order Category Volumes
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FaCalendarAlt /> Jun 2026
                </span>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <FaChartBar /> Customer Registration Trend
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FaCalendarAlt /> H1 2026
                </span>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customersData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                  <FaChartBar /> Catalog Services Demand Volume
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <FaCalendarAlt /> Jun 2026
                </span>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}