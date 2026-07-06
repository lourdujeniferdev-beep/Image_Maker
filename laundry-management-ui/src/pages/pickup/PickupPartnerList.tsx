import { useState, useEffect } from "react";
import { FaTruck, FaStar } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Partner, Order } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function PickupPartnerList() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"assign" | "view" | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Assignment selection
  const [selectedOrderId, setSelectedOrderId] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([mockApi.partners.list(), mockApi.orders.list()]).then(([partnerList, orderList]) => {
      setPartners(partnerList.filter((p) => p.type === "pickup"));
      setOrders(orderList);
      setLoading(false);
    });
  };

  const handleOpenAssign = (partner: Partner) => {
    setSelectedPartner(partner);
    const unassignedOrders = orders.filter((o) => o.status === "Created" && !o.pickupPartnerId);
    setSelectedOrderId(unassignedOrders[0]?.id || 0);
    setActiveModal("assign");
  };

  const handleOpenView = (partner: Partner) => {
    setSelectedPartner(partner);
    setActiveModal("view");
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner || selectedOrderId === 0) return;

    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    // Update Order
    const updatedOrder: Order = {
      ...order,
      pickupPartnerId: selectedPartner.id,
      pickupPartnerName: selectedPartner.name,
      status: "Pickup Assigned",
    };

    // Update Partner count
    const updatedPartner: Partner = {
      ...selectedPartner,
      assignedOrdersCount: selectedPartner.assignedOrdersCount + 1,
    };

    Promise.all([mockApi.orders.update(updatedOrder), mockApi.partners.update(updatedPartner)]).then(() => {
      fetchData();
      setActiveModal(null);
    });
  };

  const handleStatusChange = (partner: Partner, status: Partner["status"]) => {
    mockApi.partners.update({ ...partner, status }).then(fetchData);
  };

  // Filter & Search logic
  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);

    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedPartners = filteredPartners.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Partner>[] = [
    {
      header: "Partner Name",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-bold">
            {item.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-800 block">{item.name}</span>
            <span className="text-xs text-slate-400 block">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Mobile Phone",
      accessor: (item) => item.phone,
    },
    {
      header: "Rating",
      accessor: (item) => (
        <div className="flex items-center gap-1 font-bold text-slate-700">
          <FaStar className="text-amber-400" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      header: "Job Completion",
      accessor: (item) => (
        <div className="w-24">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Rate</span>
            <span>{item.completionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${item.completionRate}%` }}></div>
          </div>
        </div>
      ),
    },
    {
      header: "Active Jobs",
      accessor: (item) => (
        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border">
          {item.assignedOrdersCount} active
        </span>
      ),
    },
    {
      header: "Availability Status",
      accessor: (item) => {
        const colors = {
          available: "bg-green-50 text-green-700 border-green-200",
          busy: "bg-amber-50 text-amber-700 border-amber-200",
          offline: "bg-slate-100 text-slate-600 border-slate-200",
        };
        return (
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(item, e.target.value as any)}
            className={`rounded-lg border px-2 py-1 text-xs font-semibold focus:outline-none ${colors[item.status]}`}
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
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
          >
            Details
          </button>
          {item.status === "available" && (
            <button
              onClick={() => handleOpenAssign(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <FaTruck /> Assign
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterConfigs: FilterSelect[] = [
    {
      key: "status",
      label: "Availability",
      value: statusFilter,
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Available Only", value: "available" },
        { label: "Busy Only", value: "busy" },
        { label: "Offline Only", value: "offline" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  const pendingOrders = orders.filter((o) => o.status === "Created" && !o.pickupPartnerId);

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Pickup Partners" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pickup Logistics Partners</h1>
          <p className="text-slate-500 text-sm">
            Manage dispatching agents responsible for gathering dirty laundry from customer locations.
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        data={paginatedPartners}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search pickup agents by name, phone..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredPartners.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Assign Order Modal */}
      <Modal isOpen={activeModal === "assign"} onClose={() => setActiveModal(null)} title="Dispatch Pickup Courier">
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          {selectedPartner && (
            <div>
              <p className="text-sm text-slate-500 mb-4">
                Assigning a laundry collection task to <span className="font-bold text-slate-700">{selectedPartner.name}</span>.
              </p>

              {pendingOrders.length > 0 ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Awaiting Order *</label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pendingOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNumber} - {order.customerName} ({order.shopName}, ₹{order.totalAmount})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-3 rounded-lg border text-xs font-semibold text-center">
                  There are no unassigned "Created" orders in queue.
                </div>
              )}
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
              disabled={pendingOrders.length === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition disabled:opacity-50"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Pickup Partner Details">
        {selectedPartner && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase">
                {selectedPartner.name.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedPartner.name}</h4>
                <p className="text-xs text-slate-400">Pickup Logistics Courier</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedPartner.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedPartner.phone}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Rating Stats</span>
                <div className="flex items-center gap-1 mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  <FaStar className="text-amber-400" />
                  <span>{selectedPartner.rating} / 5.0 stars</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Completion Rate</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedPartner.completionRate}% successful jobs</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Logistics Status</span>
                <span className="mt-1.5 block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedPartner.status === "available"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : selectedPartner.status === "busy"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {selectedPartner.status}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
