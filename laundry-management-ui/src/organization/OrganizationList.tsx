import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { mockApi } from "../services/mockApi";
import type { Organization } from "../types";
import Table from "../components/Table";
import type { Column, FilterSelect } from "../components/Table";
import Modal from "../components/Modal";
import Breadcrumbs from "../components/Breadcrumbs";

export default function OrganizationList() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals state
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = () => {
    setLoading(true);
    mockApi.organizations.list().then((data) => {
      setOrgs(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormAddress("");
    setFormStatus(true);
    setActiveModal("create");
  };

  const handleOpenEdit = (org: Organization) => {
    setSelectedOrg(org);
    setFormName(org.organizationName);
    setFormEmail(org.email);
    setFormPhone(org.phone);
    setFormAddress(org.address);
    setFormStatus(org.status);
    setActiveModal("edit");
  };

  const handleOpenView = (org: Organization) => {
    setSelectedOrg(org);
    setActiveModal("view");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.organizations
      .create({
        organizationName: formName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        status: formStatus,
      })
      .then(() => {
        fetchOrgs();
        setActiveModal(null);
      });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    mockApi.organizations
      .update({
        ...selectedOrg,
        organizationName: formName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        status: formStatus,
      })
      .then(() => {
        fetchOrgs();
        setActiveModal(null);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      mockApi.organizations.delete(id).then(() => {
        fetchOrgs();
      });
    }
  };

  // Filter and search logic
  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch =
      org.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      org.email.toLowerCase().includes(search.toLowerCase()) ||
      org.phone.includes(search);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? org.status
        : !org.status;

    return matchesSearch && matchesStatus;
  });

  // Paginated orgs
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Organization>[] = [
    {
      header: "ID",
      accessor: (item) => <span className="font-bold text-slate-500">{item.id}</span>,
    },
    {
      header: "Organization Name",
      accessor: (item) => <span className="font-semibold text-slate-900">{item.organizationName}</span>,
    },
    {
      header: "Email Address",
      accessor: (item) => item.email,
    },
    {
      header: "Phone Number",
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
            title="View Details"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50 transition cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
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
        { label: "Active Only", value: "active" },
        { label: "Inactive Only", value: "inactive" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Organizations" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Organizations</h1>
          <p className="text-slate-500 text-sm">
            Manage corporate accounts, offices, and branch configurations.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create Organization
        </button>
      </div>

      {/* Main Table Card */}
      <Table
        columns={columns}
        data={paginatedOrgs}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search organizations by name, email..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredOrgs.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create Modal */}
      <Modal isOpen={activeModal === "create"} onClose={() => setActiveModal(null)} title="Create Organization">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Organization Name *</label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Fresh Clean Laundry Ltd."
            />
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
                placeholder="info@freshlaundry.com"
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
                placeholder="9876543210"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
            <textarea
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Full address details..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="create-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="create-status" className="text-sm font-medium text-slate-700">
              Set as Active
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
              Save Organization
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={activeModal === "edit"} onClose={() => setActiveModal(null)} title="Edit Organization">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Organization Name *</label>
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
            <textarea
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="edit-status" className="text-sm font-medium text-slate-700">
              Set as Active
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
              Update Organization
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Organization Details">
        {selectedOrg && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase">
                {selectedOrg.organizationName.substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedOrg.organizationName}</h4>
                <p className="text-xs text-slate-400">Created on {selectedOrg.createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedOrg.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedOrg.phone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Office Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block whitespace-pre-wrap">
                  {selectedOrg.address || "No address provided."}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="mt-1.5 block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedOrg.status
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {selectedOrg.status ? "Active" : "Inactive"}
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