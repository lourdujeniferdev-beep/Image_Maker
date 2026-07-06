import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaTruck } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Order, OrderStatus, Partner } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"view" | "editStatus" | "assignPartner" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form states for edits
  const [newStatus, setNewStatus] = useState<OrderStatus>("Created");
  const [partnerType, setPartnerType] = useState<"pickup" | "delivery">("pickup");
  const [selectedPartnerId, setSelectedPartnerId] = useState<number>(0);

  useEffect(() => {
    fetchOrders();
    mockApi.partners.list().then(setPartners);
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    mockApi.orders.list().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  const handleOpenView = (order: Order) => {
    setSelectedOrder(order);
    setActiveModal("view");
  };

  const handleOpenEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setActiveModal("editStatus");
  };

  const handleOpenAssignPartner = (order: Order, type: "pickup" | "delivery") => {
    setSelectedOrder(order);
    setPartnerType(type);
    const firstPartner = partners.find((p) => p.type === type);
    setSelectedPartnerId(firstPartner?.id || 0);
    setActiveModal("assignPartner");
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    mockApi.orders
      .update({
        ...selectedOrder,
        status: newStatus,
      })
      .then(() => {
        fetchOrders();
        setActiveModal(null);
      });
  };

  const handleAssignPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const partner = partners.find((p) => p.id === selectedPartnerId);
    if (!partner) return;

    const updatedOrder: Order = { ...selectedOrder };
    if (partnerType === "pickup") {
      updatedOrder.pickupPartnerId = partner.id;
      updatedOrder.pickupPartnerName = partner.name;
      if (updatedOrder.status === "Created") {
        updatedOrder.status = "Pickup Assigned";
      }
    } else {
      updatedOrder.deliveryPartnerId = partner.id;
      updatedOrder.deliveryPartnerName = partner.name;
      if (updatedOrder.status === "Ready For Delivery") {
        updatedOrder.status = "Delivery Assigned";
      }
    }

    mockApi.orders.update(updatedOrder).then(() => {
      fetchOrders();
      setActiveModal(null);
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      mockApi.orders.delete(id).then(fetchOrders);
    }
  };

  // Search & Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.shopName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      accessor: (item) => <span className="font-bold text-blue-600 cursor-pointer" onClick={() => handleOpenView(item)}>{item.orderNumber}</span>,
    },
    {
      header: "Customer",
      accessor: (item) => (
        <div>
          <span className="font-bold text-slate-800 block">{item.customerName}</span>
          <span className="text-xs text-slate-400 block">{item.customerPhone}</span>
        </div>
      ),
    },
    {
      header: "Shop Location",
      accessor: (item) => item.shopName,
    },
    {
      header: "Items Count",
      accessor: (item) => {
        const count = item.services.reduce((sum, s) => sum + s.quantity, 0);
        return <span>{count} items</span>;
      },
    },
    {
      header: "Total Amount",
      accessor: (item) => <span className="font-bold text-slate-800">₹{item.totalAmount.toFixed(2)}</span>,
    },
    {
      header: "Status",
      accessor: (item) => {
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
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
              statusStyles[item.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "text-center",
      accessor: (item) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleOpenView(item)}
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
            title="View Details"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleOpenEditStatus(item)}
            className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50 transition cursor-pointer"
            title="Change Status"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() =>
              handleOpenAssignPartner(
                item,
                item.status === "Ready For Delivery" ? "delivery" : "pickup"
              )
            }
            className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
            title="Assign Logistics"
          >
            <FaTruck size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
            title="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filterConfigs: FilterSelect[] = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Created", value: "Created" },
        { label: "Pickup Assigned", value: "Pickup Assigned" },
        { label: "Clothes Collected", value: "Clothes Collected" },
        { label: "Washing In Progress", value: "Washing In Progress" },
        { label: "Ready For Delivery", value: "Ready For Delivery" },
        { label: "Delivery Assigned", value: "Delivery Assigned" },
        { label: "Delivered", value: "Delivered" },
        { label: "Cancelled", value: "Cancelled" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  // Helper for tracking timelines
  const statusSteps: OrderStatus[] = [
    "Created",
    "Pickup Assigned",
    "Clothes Collected",
    "Washing In Progress",
    "Ready For Delivery",
    "Delivery Assigned",
    "Delivered",
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Orders" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Order Ledger</h1>
          <p className="text-slate-500 text-sm">
            Process laundry orders, dispatch logistics partners, and track status.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/orders/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create New Order
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedOrders}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search orders by number, customer, shop..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredOrders.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Edit Status Modal */}
      <Modal isOpen={activeModal === "editStatus"} onClose={() => setActiveModal(null)} title="Update Order Status">
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          {selectedOrder && (
            <div>
              <p className="text-sm text-slate-500 mb-4">
                Updating status for order <span className="font-bold text-slate-700">{selectedOrder.orderNumber}</span>.
              </p>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusSteps.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
            >
              Update Status
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Logistics Partner Modal */}
      <Modal isOpen={activeModal === "assignPartner"} onClose={() => setActiveModal(null)} title={`Assign ${partnerType === "pickup" ? "Pickup" : "Delivery"} Partner`}>
        <form onSubmit={handleAssignPartnerSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-4">
              Assign logistics agent to handle order {selectedOrder?.orderNumber}.
            </p>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Available Partner</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {partners
                .filter((p) => p.type === partnerType && p.status === "available")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Rating: {p.rating} ★, Active: {p.assignedOrdersCount} jobs)
                  </option>
                ))}
              {partners.filter((p) => p.type === partnerType && p.status === "available").length === 0 && (
                <option value="" disabled>
                  No partners currently available.
                </option>
              )}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedPartnerId === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition disabled:opacity-50"
            >
              Assign Partner
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Order Details View" size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            {/* Upper Header */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div>
                <h4 className="text-xl font-bold text-blue-600">{selectedOrder.orderNumber}</h4>
                <p className="text-xs text-slate-400">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <span className="bg-white border text-slate-800 px-3 py-1.5 rounded-lg text-sm font-semibold">
                Total: ₹{selectedOrder.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Horizontal Timeline Tracker */}
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Live Tracking Timeline</span>
              {selectedOrder.status === "Cancelled" ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border text-sm text-center font-bold">
                  This order was Cancelled.
                </div>
              ) : (
                <div className="flex items-center justify-between overflow-x-auto py-2 min-w-[500px]">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = statusSteps.indexOf(selectedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* Line */}
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={`absolute left-[50%] right-[-50%] top-3.5 h-[3px] z-0 ${
                              idx < currentIdx ? "bg-green-500" : "bg-slate-200"
                            }`}
                          />
                        )}
                        {/* Dot */}
                        <div
                          className={`h-8.5 w-8.5 rounded-full flex items-center justify-center font-bold text-xs z-10 border ${
                            isCurrent
                              ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100"
                              : isCompleted
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-slate-400 border-slate-200"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        {/* Step Text */}
                        <span className="text-[10px] font-bold text-center mt-2 text-slate-500 max-w-[80px]">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Customer Details</span>
                <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl mt-1.5 space-y-1">
                  <span className="font-bold text-slate-800 block text-sm">{selectedOrder.customerName}</span>
                  <span className="text-xs text-slate-500 block">Phone: {selectedOrder.customerPhone}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Logistics Agents</span>
                <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl mt-1.5 space-y-1 text-xs text-slate-500">
                  <div>
                    <span className="font-semibold">Pickup Agent:</span>{" "}
                    {selectedOrder.pickupPartnerName || "Unassigned"}
                  </div>
                  <div>
                    <span className="font-semibold">Delivery Agent:</span>{" "}
                    {selectedOrder.deliveryPartnerName || "Unassigned"}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Service Items Ordered</span>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-slate-600">Service Name</th>
                      <th className="px-4 py-2 text-center font-semibold text-slate-600">Price</th>
                      <th className="px-4 py-2 text-center font-semibold text-slate-600">Qty</th>
                      <th className="px-4 py-2 text-right font-semibold text-slate-600">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.services.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2.5 font-medium text-slate-700">{item.name}</td>
                        <td className="px-4 py-2.5 text-center">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
