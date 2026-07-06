import {
  FaHome,
  FaBuilding,
  FaUserShield,
  FaUsers,
  FaStore,
  FaShoppingBag,
  FaMoneyBillWave,
  FaTruck,
  FaBell,
  FaChartBar,
  FaSignOutAlt,
  FaConciergeBell,
  FaMapMarkerAlt,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Organizations",
    path: "/organizations",
    icon: <FaBuilding />,
  },
  {
    name: "Roles",
    path: "/roles",
    icon: <FaUserShield />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <FaUsers />,
  },
  {
    name: "Laundry Shops",
    path: "/shops",
    icon: <FaStore />,
  },
  {
    name: "Services",
    path: "/services",
    icon: <FaConciergeBell />,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <FaShoppingBag />,
  },
  {
    name: "Payments",
    path: "/payments",
    icon: <FaMoneyBillWave />,
  },
  {
    name: "Order Tracking",
    path: "/tracking",
    icon: <FaMapMarkerAlt />,
  },
  {
    name: "Pickup Partners",
    path: "/pickup",
    icon: <FaTruck />,
  },
  {
    name: "Delivery Partners",
    path: "/delivery",
    icon: <FaTruck />,
  },
  {
    name: "Ratings & Reviews",
    path: "/ratings",
    icon: <FaStar />,
  },
  {
    name: "Complaints",
    path: "/complaints",
    icon: <FaExclamationTriangle />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <FaBell />,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaChartBar />,
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-700">
        <div>
          <h1 className="text-xl font-bold">
            Laundry ERP
          </h1>

          <p className="text-xs text-slate-400">
            Management System
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-2 transition-colors focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `mx-3 mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all
               ${
                 isActive
                   ? "bg-blue-600 text-white"
                   : "text-slate-300 hover:bg-slate-800"
               }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}

      </div>

      {/* User Section */}
      <div className="border-t border-slate-700 p-4">

        <div className="flex items-center gap-3 mb-4">

          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <h3 className="font-semibold">
              Admin
            </h3>

            <p className="text-xs text-slate-400">
              Super Admin
            </p>
          </div>

        </div>

        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-3 hover:bg-red-700 transition">

          <FaSignOutAlt />

          Logout

        </button>
      </div>

    </aside>
  );
}