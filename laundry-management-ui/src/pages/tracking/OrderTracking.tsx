import { useState } from "react";
import { FaSearch, FaTruck, FaClock, FaInbox } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Order, OrderStatus } from "../../types";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function OrderTracking() {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;

    setLoading(true);
    setNotFound(false);
    setOrder(null);

    mockApi.orders.list().then((list) => {
      const target = list.find((o) => o.orderNumber.toUpperCase() === search.trim().toUpperCase());
      setLoading(false);
      if (target) {
        setOrder(target);
      } else {
        setNotFound(true);
      }
    });
  };

  const statusSteps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: "Created", label: "Order Registered", desc: "Customer order registered in our database." },
    { status: "Pickup Assigned", label: "Pickup Assigned", desc: "Logistics partner is on the way to collect laundry." },
    { status: "Clothes Collected", label: "Clothes Collected", desc: "Items collected and checked in at the hub." },
    { status: "Washing In Progress", label: "Washing & Cleaning", desc: "Clothes undergoing selected laundry treatment." },
    { status: "Ready For Delivery", label: "Ready For Delivery", desc: "Items cleaned, pressed, packed, and ready." },
    { status: "Delivery Assigned", label: "Delivery Assigned", desc: "Delivery partner dispatched to customer location." },
    { status: "Delivered", label: "Delivered", desc: "Laundry package successfully returned to customer." },
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "Order Tracking" }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Order Tracking Board</h1>
        <p className="text-slate-500 text-sm">
          Track real-time laundry processing stages and logistics courier locations.
        </p>
      </div>

      {/* Search Input bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter Laundry Order Number (e.g. ORD-001)..."
              className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Tracking Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm font-semibold">Retrieving tracking records...</span>
        </div>
      )}

      {/* Not Found */}
      {notFound && (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
          <div className="h-14 w-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <FaInbox size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">Order Not Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            We couldn't locate any active order matching "{search}". Please verify order ID and try again.
          </p>
        </div>
      )}

      {/* Tracking Dashboard Details */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timeline Details */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-2">Live Fulfillment Status</h3>

            {order.status === "Cancelled" ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-bold text-center">
                This order was Cancelled.
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-100 ml-4.5 pl-6 py-2 space-y-6">
                {statusSteps.map((step, idx) => {
                  const currentIdx = statusSteps.findIndex((s) => s.status === order.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.status} className="relative">
                      {/* Node Indicator Dot */}
                      <div
                        className={`absolute left-[-35px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border z-10 ${
                          isCurrent
                            ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-50"
                            : isCompleted
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-slate-400 border-slate-200"
                        }`}
                      >
                        {isCompleted && !isCurrent ? "✓" : idx + 1}
                      </div>

                      {/* Content */}
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent
                              ? "text-blue-600"
                              : isCompleted
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 self-start">
            <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-2">Order Information</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Order ID</span>
                <span className="font-bold text-blue-600 text-base">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Fulfillment Shop</span>
                <span className="font-semibold text-slate-700">{order.shopName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase">Total Bill</span>
                <span className="font-bold text-slate-800">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Logistics Courier Details</span>
                <div className="space-y-2 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-slate-400" />
                    <span>
                      <strong className="text-slate-700">Pickup Agent:</strong>{" "}
                      {order.pickupPartnerName || "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaTruck className="text-slate-400" />
                    <span>
                      <strong className="text-slate-700">Delivery Agent:</strong>{" "}
                      {order.deliveryPartnerName || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}