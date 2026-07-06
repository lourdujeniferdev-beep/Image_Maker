import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Complaint } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"resolve" | "view" | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form states
  const [resolutionComment, setResolutionComment] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    setLoading(true);
    mockApi.complaints.list().then((data) => {
      setComplaints(data);
      setLoading(false);
    });
  };

  const handleOpenResolve = (comp: Complaint) => {
    setSelectedComplaint(comp);
    setResolutionComment("");
    setActiveModal("resolve");
  };

  const handleOpenView = (comp: Complaint) => {
    setSelectedComplaint(comp);
    setActiveModal("view");
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    mockApi.complaints
      .resolve(selectedComplaint.id, resolutionComment)
      .then(() => {
        fetchComplaints();
        setActiveModal(null);
      });
  };

  // Stats calculation
  const totalTickets = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const highPriorityCount = complaints.filter((c) => c.priority === "high" && c.status === "pending").length;

  // Filter & Search logic
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.issue.toLowerCase().includes(search.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" ? true : c.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Complaint>[] = [
    {
      header: "Order ID",
      accessor: (item) => <span className="font-bold text-slate-500">{item.orderNumber}</span>,
    },
    {
      header: "Customer",
      accessor: (item) => <span className="font-semibold text-slate-800">{item.customerName}</span>,
    },
    {
      header: "Issue / Description",
      accessor: (item) => <span className="text-slate-600 line-clamp-1">{item.issue}</span>,
    },
    {
      header: "Priority Level",
      accessor: (item) => {
        const styles = {
          high: "bg-red-50 text-red-700 border-red-200",
          medium: "bg-amber-50 text-amber-700 border-amber-200",
          low: "bg-blue-50 text-blue-700 border-blue-200",
        };
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[item.priority]}`}>
            {item.priority}
          </span>
        );
      },
    },
    {
      header: "Created Date",
      accessor: (item) => <span className="text-slate-400 text-xs">{item.date}</span>,
    },
    {
      header: "Status",
      accessor: (item) => {
        const styles = {
          pending: "bg-indigo-50 text-indigo-700 border-indigo-200",
          resolved: "bg-green-50 text-green-700 border-green-200",
        };
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${styles[item.status]}`}>
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
            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer text-xs font-bold"
          >
            View Details
          </button>
          {item.status === "pending" && (
            <button
              onClick={() => handleOpenResolve(item)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <FaCheckCircle /> Resolve
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterConfigs: FilterSelect[] = [
    {
      key: "priority",
      label: "Priority",
      value: priorityFilter,
      options: [
        { label: "All Priorities", value: "all" },
        { label: "High Priority", value: "high" },
        { label: "Medium Priority", value: "medium" },
        { label: "Low Priority", value: "low" },
      ],
      onChange: (val) => {
        setPriorityFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Complaints" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Support Ticket Board</h1>
          <p className="text-slate-500 text-sm">
            Address customer tickets, processing errors, and delivery disputes.
          </p>
        </div>
      </div>

      {/* Ticket Priority metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Total Tickets</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{totalTickets}</span>
          </div>
          <div className="h-10 w-10 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center">
            <FaExclamationTriangle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Pending Action</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{pendingCount}</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <FaSpinner className="animate-spin" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Resolved Tickets</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{resolvedCount}</span>
          </div>
          <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <FaCheckCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-500 block uppercase">Critical (High)</span>
            <span className="text-2xl font-black text-red-650 mt-1 block">{highPriorityCount}</span>
          </div>
          <div className="h-10 w-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <FaExclamationTriangle />
          </div>
        </div>
      </div>

      {/* Ticket List Table */}
      <Table
        columns={columns}
        data={paginatedComplaints}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search complaints by customer, order number, details..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredComplaints.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Resolve Ticket Modal */}
      <Modal isOpen={activeModal === "resolve"} onClose={() => setActiveModal(null)} title="Resolve Support Ticket">
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          {selectedComplaint && (
            <>
              <div className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border text-sm">
                <div className="font-bold text-slate-800 dark:text-slate-200">Ticket for {selectedComplaint.orderNumber}</div>
                <p className="text-xs text-slate-500 mt-1"><strong>Issue:</strong> {selectedComplaint.issue}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Resolution Summary *</label>
                <textarea
                  required
                  value={resolutionComment}
                  onChange={(e) => setResolutionComment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Summarize resolution actions taken..."
                />
              </div>
            </>
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
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition"
            >
              Close and Resolve Ticket
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Support Ticket Details">
        {selectedComplaint && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ticket for {selectedComplaint.orderNumber}</h4>
                <p className="text-xs text-slate-400">Created: {selectedComplaint.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${
                selectedComplaint.status === "resolved"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {selectedComplaint.status}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Customer Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">{selectedComplaint.customerName}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Issue Description</span>
                <p className="text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed bg-slate-50 dark:bg-slate-900/20 p-3 rounded-lg border">
                  {selectedComplaint.issue}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Priority</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize mt-1.5 ${
                  selectedComplaint.priority === "high"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : selectedComplaint.priority === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {selectedComplaint.priority}
                </span>
              </div>

              {selectedComplaint.status === "resolved" && (
                <div className="border-t pt-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resolution Log</span>
                  <p className="text-green-700 dark:text-green-400 mt-1.5 leading-relaxed bg-green-50/30 dark:bg-green-950/20 p-3 rounded-lg border border-green-100">
                    {selectedComplaint.resolution || "Resolved. No comments entered."}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
              >
                Close Ticket View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
