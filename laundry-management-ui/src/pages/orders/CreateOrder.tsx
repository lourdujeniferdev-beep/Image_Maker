import { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { LaundryShop, Service, OrderItem } from "../../types";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function CreateOrder() {
  const [shops, setShops] = useState<LaundryShop[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<number>(0);
  const [orderItems, setOrderItems] = useState<{ serviceId: number; quantity: number }[]>([
    { serviceId: 0, quantity: 1 },
  ]);

  // Messages
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([mockApi.shops.list(), mockApi.services.list()]).then(([shopData, svcData]) => {
      setShops(shopData.filter((s) => s.status));
      setServices(svcData.filter((s) => s.status));
      if (shopData.length > 0) setSelectedShopId(shopData[0].id);
      setLoading(false);
    });
  }, []);

  const handleAddItem = () => {
    const firstSvcId = services[0]?.id || 0;
    setOrderItems([...orderItems, { serviceId: firstSvcId, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length === 1) return;
    setOrderItems(orderItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: "serviceId" | "quantity", value: number) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  // Calculations
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const svc = services.find((s) => s.id === item.serviceId);
      const price = svc ? svc.price : 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!customerName || !customerPhone) {
      setErrorMsg("Please fill in customer details.");
      return;
    }

    if (orderItems.some((item) => item.serviceId === 0 || item.quantity <= 0)) {
      setErrorMsg("Please select services and enter valid quantities.");
      return;
    }

    const shop = shops.find((s) => s.id === selectedShopId);
    if (!shop) {
      setErrorMsg("Please select a laundry shop.");
      return;
    }

    // Prepare Items
    const formattedServices: OrderItem[] = orderItems.map((item) => {
      const svc = services.find((s) => s.id === item.serviceId)!;
      return {
        serviceId: item.serviceId,
        name: svc.name,
        quantity: item.quantity,
        price: svc.price,
      };
    });

    mockApi.orders
      .create({
        customerName,
        customerPhone,
        shopId: selectedShopId,
        shopName: shop.name,
        services: formattedServices,
        totalAmount: calculateTotal(),
        status: "Created",
      })
      .then(() => {
        window.location.href = "/orders";
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-semibold text-slate-500">Loading Forms...</span>
      </div>
    );
  }

  const grandTotal = calculateTotal();

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Orders", path: "/orders" },
          { label: "Create Order" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => (window.location.href = "/orders")}
          className="p-2 border rounded-xl hover:bg-slate-50 cursor-pointer bg-white text-slate-600"
        >
          <FaArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Create New Laundry Order</h1>
          <p className="text-slate-500 text-sm">Register a new customer request in the system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Location */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b pb-2 mb-2">Customer & Shop Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fulfillment Laundry Shop *</label>
              <select
                value={selectedShopId}
                onChange={(e) => setSelectedShopId(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} - {shop.address}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Selector */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h3 className="text-base font-bold text-slate-800">Services Requested</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <FaPlus size={10} /> Add Service
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-700 border border-red-200 text-xs px-4 py-3 rounded-lg font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              {orderItems.map((item, idx) => {
                const selectedSvc = services.find((s) => s.id === item.serviceId);
                const subtotal = selectedSvc ? selectedSvc.price * item.quantity : 0;

                return (
                  <div key={idx} className="flex gap-4 items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Select Service</label>
                      <select
                        value={item.serviceId}
                        onChange={(e) => handleItemChange(idx, "serviceId", Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none"
                      >
                        <option value={0}>Select a service...</option>
                        {services.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name} (₹{svc.price.toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-24">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-center focus:outline-none"
                      />
                    </div>

                    <div className="w-24 text-right pr-2">
                      <span className="block text-xs font-bold text-slate-400 mb-1">Subtotal</span>
                      <span className="text-sm font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <button
                      type="button"
                      disabled={orderItems.length === 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section - Receipt Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 space-y-6 sticky top-6">
            <h3 className="text-base font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
              <FaShoppingBag /> Order Billing Summary
            </h3>

            <div className="space-y-4 text-sm text-slate-300">
              {orderItems.map((item, idx) => {
                const svc = services.find((s) => s.id === item.serviceId);
                if (!svc) return null;
                return (
                  <div key={idx} className="flex justify-between">
                    <span className="line-clamp-1 max-w-[150px]">
                      {svc.name} x {item.quantity}
                    </span>
                    <span>₹{(svc.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
              {orderItems.every((item) => item.serviceId === 0) && (
                <div className="text-xs text-slate-500 py-2 text-center">No services selected.</div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
              <span className="text-sm font-bold">Total Amount Due</span>
              <span className="text-2xl font-black text-blue-400">₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer text-center text-sm shadow-md"
            >
              Confirm and Create Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}