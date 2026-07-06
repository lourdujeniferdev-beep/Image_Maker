import React from "react";
import { FaSearch, FaChevronLeft, FaChevronRight, FaInbox } from "react-icons/fa";

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSelect {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  // Search
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  // Filters
  filters?: FilterSelect[];
  // Pagination
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Empty State
  emptyTitle?: string;
  emptyDesc?: string;
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  emptyTitle = "No data found",
  emptyDesc = "There are no records to display matching your criteria.",
}: TableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Determine starting and ending display indexes
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      {(onSearchChange || filters) && (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
          {/* Search Box */}
          {onSearchChange && (
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-slate-100"
              />
            </div>
          )}

          {/* Additional Filter Selects */}
          {filters && filters.length > 0 && (
            <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {filter.label}:
                  </span>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="w-full sm:w-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700/50 relative min-h-[200px]">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Loading records...
              </span>
            </div>
          </div>
        )}

        {/* Scrollable Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                {columns.map((col, index) => (
                  <th key={index} className={`px-6 py-4 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300 text-sm"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-6 py-4 ${col.className || ""}`}>
                        {col.accessor(item)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                // Only show empty state if not loading
                !loading && (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                        <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                          <FaInbox size={28} />
                        </div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                          {emptyTitle}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {emptyDesc}
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/30 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500">
          {/* Info */}
          <div>
            Showing <span className="font-bold text-slate-700 dark:text-slate-300">{startIdx}</span> to{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{endIdx}</span> of{" "}
            <span className="font-bold text-slate-700 dark:text-slate-300">{totalItems}</span> records
          </div>

          {/* Actions & Selector */}
          <div className="flex items-center gap-4">
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}

            {/* Nav Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-50 transition cursor-pointer"
              >
                <FaChevronLeft size={12} />
              </button>

              <div className="text-xs">
                Page <span className="font-bold text-slate-700 dark:text-slate-300">{currentPage}</span> of{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">{totalPages}</span>
              </div>

              <button
                disabled={currentPage === totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-50 transition cursor-pointer"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
