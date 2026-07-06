import { useState, useEffect } from "react";
import { FaBell, FaPaperPlane } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Notification } from "../../types";
import Table from "../../components/Table";
import type { Column } from "../../components/Table";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function Notificationlist() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formGroup, setFormGroup] = useState<Notification["recipientGroup"]>("all");

  // Success Alert Toast
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    mockApi.notifications.list().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    mockApi.notifications
      .create({
        title: formTitle,
        message: formMsg,
        recipientGroup: formGroup,
      })
      .then(() => {
        fetchNotifications();
        setFormTitle("");
        setFormMsg("");
        setFormGroup("all");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      });
  };

  // Search logic
  const filteredNotifications = notifications.filter((n) => {
    return (
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Notification>[] = [
    {
      header: "Alert Title",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <FaBell className="text-blue-500" />
          <span className="font-bold text-slate-800">{item.title}</span>
        </div>
      ),
    },
    {
      header: "Recipient Group",
      accessor: (item) => {
        const labels = {
          all: "Broadcast (All)",
          customers: "Customers Only",
          partners: "Logistics Partners",
          shops: "Shop Outlets",
        };
        return (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">
            {labels[item.recipientGroup]}
          </span>
        );
      },
    },
    {
      header: "Message Details",
      accessor: (item) => <span className="text-slate-500 line-clamp-1">{item.message}</span>,
    },
    {
      header: "Sent Date",
      accessor: (item) => <span className="text-slate-400 text-xs">{item.date}</span>,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Notifications" }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Broadcast Alerts</h1>
        <p className="text-slate-500 text-sm">
          Send announcements, operational warnings, and promotion alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Sender Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <FaBell /> Broadcast Dispatcher
          </h3>

          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 text-xs px-4 py-3 rounded-lg font-semibold">
              Announcement dispatched successfully!
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Alert Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Announce upgrade..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Group *</label>
              <select
                value={formGroup}
                onChange={(e) => setFormGroup(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm bg-white focus:outline-none"
              >
                <option value="all">All Channels (Broadcast)</option>
                <option value="customers">Customers</option>
                <option value="partners">Logistics Partners</option>
                <option value="shops">Laundry Shop Owners</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message Description *</label>
              <textarea
                required
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                placeholder="Type your message description here..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <FaPaperPlane size={12} /> Dispatch Alert
            </button>
          </form>
        </div>

        {/* History Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <Table
            columns={columns}
            data={paginatedNotifications}
            loading={loading}
            searchQuery={search}
            onSearchChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search message archives..."
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredNotifications.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}