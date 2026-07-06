import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaUserCircle, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { mockApi } from "../services/mockApi";
import type { User, Role } from "../types";
import Table from "../components/Table";
import type { Column, FilterSelect } from "../components/Table";
import Modal from "../components/Modal";
import Breadcrumbs from "../components/Breadcrumbs";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formFullname, setFormFullname] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formStatus, setFormStatus] = useState(true);

  useEffect(() => {
    fetchUsers();
    mockApi.roles.list().then(setRoles);
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    mockApi.users.list().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormUsername("");
    setFormFullname("");
    setFormEmail("");
    setFormMobile("");
    setFormRole(roles[0]?.name || "Super Admin");
    setFormStatus(true);
    setActiveModal("create");
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFormUsername(user.username);
    setFormFullname(user.fullname);
    setFormEmail(user.email);
    setFormMobile(user.mobile);
    setFormRole(user.role);
    setFormStatus(user.status);
    setActiveModal("edit");
  };

  const handleOpenView = (user: User) => {
    setSelectedUser(user);
    setActiveModal("view");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.users
      .create({
        username: formUsername,
        fullname: formFullname,
        email: formEmail,
        mobile: formMobile,
        role: formRole,
        status: formStatus,
      })
      .then(() => {
        fetchUsers();
        setActiveModal(null);
      });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    mockApi.users
      .update({
        ...selectedUser,
        username: formUsername,
        fullname: formFullname,
        email: formEmail,
        mobile: formMobile,
        role: formRole,
        status: formStatus,
      })
      .then(() => {
        fetchUsers();
        setActiveModal(null);
      });
  };

  const handleToggleStatus = (user: User) => {
    const updatedUser = { ...user, status: !user.status };
    mockApi.users.update(updatedUser).then(fetchUsers);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      mockApi.users.delete(id).then(() => {
        fetchUsers();
      });
    }
  };

  // Filter & Search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.mobile.includes(search);

    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<User>[] = [
    {
      header: "User",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="text-slate-400">
            <FaUserCircle size={32} />
          </div>
          <div>
            <span className="font-bold text-slate-800 block">{item.fullname}</span>
            <span className="text-xs text-slate-400 block">@{item.username}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Email",
      accessor: (item) => item.email,
    },
    {
      header: "Mobile",
      accessor: (item) => item.mobile,
    },
    {
      header: "Role",
      accessor: (item) => (
        <span className="bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          {item.role}
        </span>
      ),
    },
    {
      header: "Status Toggle",
      accessor: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleStatus(item)}
            className="text-slate-400 hover:text-slate-600 transition focus:outline-none cursor-pointer"
          >
            {item.status ? (
              <FaToggleOn className="text-green-500" size={24} />
            ) : (
              <FaToggleOff className="text-slate-300" size={24} />
            )}
          </button>
          <span className="text-xs font-semibold text-slate-500">
            {item.status ? "Active" : "Suspended"}
          </span>
        </div>
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
          {item.id > 1 && ( // Prevent deleting main admin account
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              <FaTrash size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterConfigs: FilterSelect[] = [
    {
      key: "role",
      label: "Role",
      value: roleFilter,
      options: [
        { label: "All Roles", value: "all" },
        ...roles.map((r) => ({ label: r.name, value: r.name })),
      ],
      onChange: (val) => {
        setRoleFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Users" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Directory</h1>
          <p className="text-slate-500 text-sm">
            Configure system access users, roles assignments, and login credentials.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create New User
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedUsers}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search users by name, username, email..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create Modal */}
      <Modal isOpen={activeModal === "create"} onClose={() => setActiveModal(null)} title="Create User">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                required
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. john_doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formFullname}
                onChange={(e) => setFormFullname(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
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
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile *</label>
              <input
                type="tel"
                required
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9876543210"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Role assignment *</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="user-create-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="user-create-status" className="text-sm font-medium text-slate-700">
              Active Access Account
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
              Save User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={activeModal === "edit"} onClose={() => setActiveModal(null)} title="Edit User Account">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username *</label>
              <input
                type="text"
                required
                disabled
                value={formUsername}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm bg-slate-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formFullname}
                onChange={(e) => setFormFullname(e.target.value)}
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
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile *</label>
              <input
                type="tel"
                required
                value={formMobile}
                onChange={(e) => setFormMobile(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Role assignment *</label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="user-edit-status"
              checked={formStatus}
              onChange={(e) => setFormStatus(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="user-edit-status" className="text-sm font-medium text-slate-700">
              Active Access Account
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
              Update User
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="User Account Details">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
              <div className="text-blue-600">
                <FaUserCircle size={56} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedUser.fullname}</h4>
                <p className="text-xs text-slate-400">Registered on {selectedUser.createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Username</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">@{selectedUser.username}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Assigned Role</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                <span className="text-sm text-slate-800 dark:text-slate-200 mt-1 block">{selectedUser.mobile}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="mt-1.5 block">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      selectedUser.status
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {selectedUser.status ? "Active" : "Suspended"}
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