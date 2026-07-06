import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaConciergeBell } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Service } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Wash & Fold");
  const [formPrice, setFormPrice] = useState(0);
  const [formDesc, setFormDesc] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    mockApi.services.list().then((data) => {
      setServices(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormName("");
    setFormCategory("Wash & Fold");
    setFormPrice(0);
    setFormDesc("");
    setFormStatus(true);
    setActiveModal("create");
  };

  const handleOpenEdit = (svc: Service) => {
    setSelectedService(svc);
    setFormName(svc.name);
    setFormCategory(svc.category);
    setFormPrice(svc.price);
    setFormDesc(svc.description);
    setFormStatus(svc.status);
    setActiveModal("edit");
  };

  const handleOpenView = (svc: Service) => {
    setSelectedService(svc);
    setActiveModal("view");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.services
      .create({
        name: formName,
        category: formCategory,
        price: formPrice,
        description: formDesc,
        status: formStatus,
      })
      .then(() => {
        fetchServices();
        setActiveModal(null);
      });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    mockApi.services
      .update({
        ...selectedService,
        name: formName,
        category: formCategory,
        price: formPrice,
        description: formDesc,
        status: formStatus,
      })
      .then(() => {
        fetchServices();
        setActiveModal(null);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      mockApi.services.delete(id).then(() => {
        fetchServices();
      });
    }
  };

  // Search & Category logic
  const filteredServices = services.filter((svc) => {
    const matchesSearch =
      svc.name.toLowerCase().includes(search.toLowerCase()) ||
      svc.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ? true : svc.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Service>[] = [
    {
      header: "Service",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
            <FaConciergeBell size={18} />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">{item.name}</span>
            <span className="text-xs text-slate-400 block">{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: (item) => <span className="text-slate-500 line-clamp-1">{item.description}</span>,
    },
    {
      header: "Unit Price",
      accessor: (item) => <span className="font-bold text-slate-800 dark:text-slate-200">₹{item.price.toFixed(2)}</span>,
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
          {item.status ? "Active" : "Inactive"}
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
      key: "category",
      label: "Category",
      value: categoryFilter,
      options: [
        { label: "All Categories", value: "all" },
        { label: "Wash & Fold", value: "Wash & Fold" },
        { label: "Dry Clean", value: "Dry Clean" },
        { label: "Ironing", value: "Ironing" },
        { label: "Heavy Wash", value: "Heavy Wash" },
      ],
      onChange: (val) => {
        setCategoryFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Services" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Service Management</h1>
          <p className="text-slate-500 text-sm">
            Configure catalog catalog laundry categories, base billing pricing, and description.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create New Service
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedServices}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search services by name, description..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredServices.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create Modal */}
      <Modal isOpen={activeModal === "create"} onClose={() => setActiveModal(null)} title="Create New Service">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Service Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Silk Dress Dry Cleaning"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wash & Fold">Wash & Fold</option>
                <option value="Dry Clean">Dry Clean</option>
                <option value="Ironing">Ironing</option>
                <option value="Heavy Wash">Heavy Wash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Detailed description of cleaning method..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="service-create-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="service-create-status" className="text-sm font-medium text-slate-700">
              Active Service (Visible to customers)
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
              Save Service
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={activeModal === "edit"} onClose={() => setActiveModal(null)} title="Edit Service Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Service Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Wash & Fold">Wash & Fold</option>
                <option value="Dry Clean">Dry Clean</option>
                <option value="Ironing">Ironing</option>
                <option value="Heavy Wash">Heavy Wash</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="service-edit-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="service-edit-status" className="text-sm font-medium text-slate-700">
              Active Service (Visible to customers)
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
              Update Service
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Service Details">
        {selectedService && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                <FaConciergeBell />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedService.name}</h4>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded mt-1 inline-block">
                  {selectedService.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Base Unit Price</span>
                <span className="text-xl font-black text-slate-850 dark:text-slate-100 mt-1 block">₹{selectedService.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Service Status</span>
                <span className="mt-1.5 block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedService.status
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {selectedService.status ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Description details</span>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border">
                  {selectedService.description || "No description cataloged for this service."}
                </p>
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
