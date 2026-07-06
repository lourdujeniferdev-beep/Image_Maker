import { Link } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbsProps {
  items: { label: string; path?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
      <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
        <FaHome className="text-base" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FaChevronRight className="text-xs text-slate-400" />
          {item.path ? (
            <Link to={item.path} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
