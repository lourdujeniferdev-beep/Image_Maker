import { useState, useEffect } from "react";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Payment } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"process" | "view" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Cash" | "NetBanking">("UPI");
  const [paymentStatus, setPaymentStatus] = useState<"Completed" | "Failed">("Completed");
  const [referenceId, setReferenceId] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    setLoading(true);
    mockApi.payments.list().then((data) => {
      setPayments(data);
      setLoading(false);
    });
  };

  const handleOpenProcess = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentMethod("UPI");
    setPaymentStatus("Completed");
    setReferenceId("");
    setActiveModal("process");
  };

  const handleOpenView = (payment: Payment) => {
    setSelectedPayment(payment);
    setActiveModal("view");
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    mockApi.payments
      .updateStatus(
        selectedPayment.id,
        paymentStatus,
        paymentMethod,
        referenceId || `TXN${Date.now().toString().substring(5)}`
      )
      .then(() => {
        fetchPayments();
        setActiveModal(null);
      });
  };

  // Search & Filter logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Payment>[] = [
    {
      header: "Txn ID",
      accessor: (item) => (
        <span className="font-bold text-slate-500 cursor-pointer" onClick={() => handleOpenView(item)}>
          {item.referenceId}
        </span>
      ),
    },
    {
      header: "Order Number",
      accessor: (item) => <span className="font-semibold text-blue-600">{item.orderNumber}</span>,
    },
    {
      header: "Customer",
      accessor: (item) => item.customerName,
    },
    {
      header: "Amount",
      accessor: (item) => <span className="font-bold text-slate-800">₹{item.amount.toFixed(2)}</span>,
    },
    {
      header: "Payment Method",
      accessor: (item) => (
        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-700">
          {item.method}
        </span>
      ),
    },
    {
      header: "Transaction Date",
      accessor: (item) => new Date(item.transactionDate).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (item) => {
        const styles = {
          Pending: "bg-amber-50 text-amber-700 border-amber-200",
          Completed: "bg-green-50 text-green-700 border-green-200",
          Failed: "bg-red-50 text-red-700 border-red-200",
        };
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[item.status]}`}>
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
          {item.status === "Pending" ? (
            <button
              onClick={() => handleOpenProcess(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <FaMoneyBillWave /> Process
            </button>
          ) : (
            <button
              onClick={() => handleOpenView(item)}
              className="border hover:bg-slate-50 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Receipt
            </button>
          )}
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
        { label: "Pending", value: "Pending" },
        { label: "Completed", value: "Completed" },
        { label: "Failed", value: "Failed" },
      ],
      onChange: (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Payments" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payments & Transactions</h1>
          <p className="text-slate-500 text-sm">
            Monitor customer checkout transactions, settlement ledger logs, and cash receipts.
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        data={paginatedPayments}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search payments by order number, customer name, reference..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredPayments.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Process Payment Modal */}
      <Modal isOpen={activeModal === "process"} onClose={() => setActiveModal(null)} title="Process Transaction Payment">
        <form onSubmit={handleProcessSubmit} className="space-y-4">
          {selectedPayment && (
            <>
              <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl space-y-2 border">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Order Number:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPayment.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPayment.customerName}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-slate-400">Grand Total Due:</span>
                  <span className="font-black text-blue-600 text-base">₹{selectedPayment.amount.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UPI">UPI / Digital Wallet</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cash">Cash on Delivery</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Transaction Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Completed">Completed (Success)</option>
                  <option value="Failed">Failed / Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reference ID / Txn Hash (Optional)</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. TXN98765432"
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
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
            >
              Process Transaction
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Transaction Payment Receipt">
        {selectedPayment && (
          <div className="space-y-6">
            <div className="text-center py-4 border-b">
              {selectedPayment.status === "Completed" ? (
                <div className="flex flex-col items-center gap-1 text-green-600">
                  <FaCheckCircle size={48} />
                  <span className="font-bold text-lg">Payment Successful</span>
                </div>
              ) : selectedPayment.status === "Failed" ? (
                <div className="flex flex-col items-center gap-1 text-red-600">
                  <FaExclamationCircle size={48} />
                  <span className="font-bold text-lg">Transaction Failed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-amber-500">
                  <FaMoneyBillWave size={48} />
                  <span className="font-bold text-lg">Awaiting Settlement</span>
                </div>
              )}
              <span className="text-slate-400 text-xs mt-2 block">Reference ID: {selectedPayment.referenceId}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Associated:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method Used:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPayment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(selectedPayment.transactionDate).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Settled</span>
                <span className="font-black text-blue-600">₹{selectedPayment.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}