import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600"
        >
          <FaBars size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500">
            Welcome back 👋
          </p>
        </div>

      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center w-96">

        <div className="relative w-full">

          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search orders, users, shops..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <button className="relative">

          <FaBell
            size={22}
            className="text-slate-600"
          />

          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            5
          </span>

        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 cursor-pointer">

          <FaUserCircle
            size={38}
            className="text-slate-600"
          />

          <div className="hidden md:block">

            <h3 className="font-semibold text-slate-800">
              Admin User
            </h3>

            <p className="text-xs text-slate-500">
              Super Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}