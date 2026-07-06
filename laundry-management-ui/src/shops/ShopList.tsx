import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaStore } from "react-icons/fa";
import { mockApi } from "../services/mockApi";
import type { LaundryShop } from "../types";
import Table from "../components/Table";
import type { Column, FilterSelect } from "../components/Table";
import Modal from "../components/Modal";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ShopList() {
  const [shops, setShops] = useState<LaundryShop[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedShop, setSelectedShop] = useState<LaundryShop | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formOwner, setFormOwner] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = () => {
    setLoading(true);
    mockApi.shops.list().then((data) => {
      setShops(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormName("");
    setFormOwner("");
    setFormEmail("");
    setFormPhone("");
    setFormAddress("");
    setFormStatus(true);
    setActiveModal("create");
  };

  const handleOpenEdit = (shop: LaundryShop) => {
    setSelectedShop(shop);
    setFormName(shop.name);
    setFormOwner(shop.ownerName);
    setFormEmail(shop.email);
    setFormPhone(shop.phone);
    setFormAddress(shop.address);
    setFormStatus(shop.status);
    setActiveModal("edit");
  };

  const handleOpenView = (shop: LaundryShop) => {
    setSelectedShop(shop);
    setActiveModal("view");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.shops
      .create({
        name: formName,
        ownerName: formOwner,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        status: formStatus,
      })
      .then(() => {
        fetchShops();
        setActiveModal(null);
      });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;
    mockApi.shops
      .update({
        ...selectedShop,
        name: formName,
        ownerName: formOwner,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        status: formStatus,
      })
      .then(() => {
        fetchShops();
        setActiveModal(null);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      mockApi.shops.delete(id).then(() => {
        fetchShops();
      });
    }
  };

  // Search & Filter logic
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      shop.email.toLowerCase().includes(search.toLowerCase()) ||
      shop.phone.includes(search);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? shop.status
        : !shop.status;

    return matchesSearch && matchesStatus;
  });

  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<LaundryShop>[] = [
    {
      header: "Laundry Shop",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <FaStore size={18} />
          </div>
          <div>
            <span className="font-bold text-slate-850 block">{item.name}</span>
            <span className="text-xs text-slate-400 block">Owner: {item.ownerName}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: (item) => item.email,
    },
    {
      header: "Phone",
      accessor: (item) => item.phone,
    },
    {
      header: "Status",
      accessor: (item) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
            item.status
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {item.status ? "Open" : "Closed"}
        </span>
      ),
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
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50 transition cursor-pointer"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
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
        { label: "Open Only", value: "active" },
        { label: "Closed Only", value: "inactive" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Laundry Shops" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Laundry Shop Management</h1>
          <p className="text-slate-500 text-sm">
            Configure partner laundry outlets, operational status, and physical locations.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create New Shop
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedShops}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search shops by name, owner, email..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredShops.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create Modal */}
      <Modal isOpen={activeModal === "create"} onClose={() => setActiveModal(null)} title="Register Laundry Shop">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Express Clean Queens"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Owner"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="shop@domain.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="718-555-0100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Location Address *</label>
            <textarea
              required
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="e.g. 789 Queens Blvd, NY"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shop-create-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="shop-create-status" className="text-sm font-medium text-slate-700">
              Set Shop as Operational (Open)
            </label>
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
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
            >
              Register Shop
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={activeModal === "edit"} onClose={() => setActiveModal(null)} title="Edit Shop Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={formOwner}
                onChange={(e) => setFormOwner(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Location Address *</label>
            <textarea
              required
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="shop-edit-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="shop-edit-status" className="text-sm font-medium text-slate-700">
              Set Shop as Operational (Open)
            </label>
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
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
            >
              Update Shop
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Laundry Shop Details">
        {selectedShop && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                <FaStore />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedShop.name}</h4>
                <p className="text-xs text-slate-400">Registered on {selectedShop.createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Owner Name</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedShop.ownerName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="mt-1.5 block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedShop.status
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {selectedShop.status ? "Open" : "Closed"}
                  </span>
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedShop.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedShop.phone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Location Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block whitespace-pre-wrap">{selectedShop.address}</span>
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