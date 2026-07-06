import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { mockApi } from "../services/mockApi";
import type { Role, Permission } from "../types";
import Table from "../components/Table";
import type { Column } from "../components/Table";
import Modal from "../components/Modal";
import Breadcrumbs from "../components/Breadcrumbs";

const defaultPermissions = (): Record<string, Permission> => ({
  organizations: { view: false, create: false, edit: false, delete: false },
  roles: { view: false, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
  shops: { view: false, create: false, edit: false, delete: false },
  services: { view: false, create: false, edit: false, delete: false },
  orders: { view: false, create: false, edit: false, delete: false },
  payments: { view: false, create: false, edit: false, delete: false },
  complaints: { view: false, create: false, edit: false, delete: false },
  notifications: { view: false, create: false, edit: false, delete: false },
  reports: { view: false, create: false, edit: false, delete: false },
});

export default function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPerms, setFormPerms] = useState<Record<string, Permission>>(defaultPermissions());

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    setLoading(true);
    mockApi.roles.list().then((data) => {
      setRoles(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormName("");
    setFormDesc("");
    setFormPerms(defaultPermissions());
    setActiveModal("create");
  };

  const handleOpenEdit = (role: Role) => {
    setSelectedRole(role);
    setFormName(role.name);
    setFormDesc(role.description);
    // Merge role permissions with defaults to prevent crashes on missing keys
    setFormPerms({
      ...defaultPermissions(),
      ...role.permissions,
    });
    setActiveModal("edit");
  };

  const handleOpenView = (role: Role) => {
    setSelectedRole(role);
    setActiveModal("view");
  };

  const handlePermissionChange = (module: string, action: keyof Permission, value: boolean) => {
    setFormPerms((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: value,
      },
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.roles
      .create({
        name: formName,
        description: formDesc,
        permissions: formPerms,
      })
      .then(() => {
        fetchRoles();
        setActiveModal(null);
      });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    mockApi.roles
      .update({
        ...selectedRole,
        name: formName,
        description: formDesc,
        permissions: formPerms,
      })
      .then(() => {
        fetchRoles();
        setActiveModal(null);
      });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      mockApi.roles.delete(id).then(() => {
        fetchRoles();
      });
    }
  };

  // Search logic
  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Role>[] = [
    {
      header: "ID",
      accessor: (item) => <span className="font-bold text-slate-500">{item.id}</span>,
    },
    {
      header: "Role Name",
      accessor: (item) => <span className="font-semibold text-slate-900">{item.name}</span>,
    },
    {
      header: "Description",
      accessor: (item) => <span className="text-slate-500 line-clamp-1">{item.description}</span>,
    },
    {
      header: "Permission Count",
      accessor: (item) => {
        let count = 0;
        Object.values(item.permissions).forEach((p) => {
          if (p.view) count++;
          if (p.create) count++;
          if (p.edit) count++;
          if (p.delete) count++;
        });
        return (
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-100">
            {count} grants
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
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => handleOpenEdit(item)}
            className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50 transition cursor-pointer"
          >
            <FaEdit size={16} />
          </button>
          {item.id > 2 && ( // Prevent deleting Super Admin & Shop Manager defaults
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

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Roles" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Role Management</h1>
          <p className="text-slate-500 text-sm">
            Control dashboard permission boundaries and configure administrative groups.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Create New Role
        </button>
      </div>

      <Table
        columns={columns}
        data={paginatedRoles}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search roles by name..."
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredRoles.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={activeModal === "create" || activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        title={activeModal === "create" ? "Create New Role" : "Edit Role Permissions"}
        size="xl"
      >
        <form onSubmit={activeModal === "create" ? handleCreateSubmit : handleEditSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Role Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Accountant"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Summarize access rules..."
                />
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="md:col-span-2">
              <span className="block text-sm font-bold text-slate-700 mb-3">Permissions Matrix</span>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">Module</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">View</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">Create</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">Edit</th>
                      <th className="px-4 py-3 text-center font-semibold text-slate-600">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(formPerms).map((module) => (
                      <tr key={module} className="border-b last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-700 capitalize">{module}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={formPerms[module].view}
                            onChange={(e) => handlePermissionChange(module, "view", e.target.checked)}
                            className="h-4.5 w-4.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={formPerms[module].create}
                            onChange={(e) => handlePermissionChange(module, "create", e.target.checked)}
                            className="h-4.5 w-4.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={formPerms[module].edit}
                            onChange={(e) => handlePermissionChange(module, "edit", e.target.checked)}
                            className="h-4.5 w-4.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={formPerms[module].delete}
                            onChange={(e) => handlePermissionChange(module, "delete", e.target.checked)}
                            className="h-4.5 w-4.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
              {activeModal === "create" ? "Save Role" : "Update Role"}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={activeModal === "view"} onClose={() => setActiveModal(null)} title="Role Details" size="lg">
        {selectedRole && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedRole.name}</h4>
              <p className="text-sm text-slate-500 mt-1">{selectedRole.description || "No description provided."}</p>
            </div>

            <div>
              <h5 className="text-sm font-bold text-slate-700 mb-3">Module Permissions Detail</h5>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold text-slate-600">Module</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-slate-600">View</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-slate-600">Create</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-slate-600">Edit</th>
                      <th className="px-4 py-2.5 text-center font-semibold text-slate-600">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedRole.permissions).map(([module, p]) => (
                      <tr key={module} className="border-t hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 font-semibold text-slate-700 capitalize">{module}</td>
                        <td className="px-4 py-3.5 text-center">
                          {p.view ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.create ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.edit ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-slate-300 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.delete ? (
                            <FaCheckCircle className="text-green-500 mx-auto" />
                          ) : (
                            <FaTimesCircle className="text-slate-300 mx-auto" />
                          )}
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
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}