import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { mockApi } from "../../services/mockApi";
import type { Rating } from "../../types";
import Table from "../../components/Table";
import type { Column, FilterSelect } from "../../components/Table";
import Modal from "../../components/Modal";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function Ratinglist() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [starsFilter, setStarsFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [activeModal, setActiveModal] = useState<"create" | null>(null);

  // Form states
  const [formOrderNum, setFormOrderNum] = useState("");
  const [formCustomer, setFormCustomer] = useState("");
  const [formStars, setFormStars] = useState(5);
  const [formComment, setFormComment] = useState("");

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = () => {
    setLoading(true);
    mockApi.ratings.list().then((data) => {
      setRatings(data);
      setLoading(false);
    });
  };

  const handleOpenCreate = () => {
    setFormOrderNum("");
    setFormCustomer("");
    setFormStars(5);
    setFormComment("");
    setActiveModal("create");
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mockApi.ratings
      .create({
        orderNumber: formOrderNum,
        customerName: formCustomer,
        rating: formStars,
        comment: formComment,
      })
      .then(() => {
        fetchRatings();
        setActiveModal(null);
      });
  };

  // Stats calculation
  const totalReviews = ratings.length;
  const avgRating = totalReviews > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  const starCounts = [0, 0, 0, 0, 0]; // Index 0 represents 5 stars, ..., Index 4 represents 1 star
  ratings.forEach((r) => {
    const starIndex = 5 - r.rating;
    if (starIndex >= 0 && starIndex < 5) starCounts[starIndex]++;
  });

  // Filter & Search logic
  const filteredRatings = ratings.filter((r) => {
    const matchesSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());

    const matchesStars =
      starsFilter === "all" ? true : r.rating === Number(starsFilter);

    return matchesSearch && matchesStars;
  });

  const paginatedRatings = filteredRatings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: Column<Rating>[] = [
    {
      header: "Order ID",
      accessor: (item) => <span className="font-bold text-slate-500">{item.orderNumber}</span>,
    },
    {
      header: "Customer",
      accessor: (item) => <span className="font-semibold text-slate-800">{item.customerName}</span>,
    },
    {
      header: "Rating Stars",
      accessor: (item) => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <FaStar
              key={idx}
              className={idx < item.rating ? "text-amber-400" : "text-slate-200"}
              size={14}
            />
          ))}
        </div>
      ),
    },
    {
      header: "Review Feedback",
      accessor: (item) => <span className="text-slate-650 italic">"{item.comment}"</span>,
    },
    {
      header: "Submit Date",
      accessor: (item) => <span className="text-slate-400 text-xs">{item.date}</span>,
    },
  ];

  const filterConfigs: FilterSelect[] = [
    {
      key: "stars",
      label: "Rating Filter",
      value: starsFilter,
      options: [
        { label: "All Ratings", value: "all" },
        { label: "5 Stars Only", value: "5" },
        { label: "4 Stars Only", value: "4" },
        { label: "3 Stars Only", value: "3" },
        { label: "2 Stars & Under", value: "2" },
      ],
      onChange: (val) => {
        setStarsFilter(val);
        setCurrentPage(1);
      },
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <Breadcrumbs items={[{ label: "Ratings & Reviews" }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ratings & Reviews</h1>
          <p className="text-slate-500 text-sm">
            Analyze customer experience, satisfaction levels, and written testimonials.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer text-sm"
        >
          + Add New Review
        </button>
      </div>

      {/* Review Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        {/* Core Stats */}
        <div className="flex flex-col justify-center items-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
          <span className="text-sm font-semibold text-slate-400 block uppercase">Average Score</span>
          <span className="text-5xl font-black text-slate-800 mt-2 block">{avgRating.toFixed(1)}</span>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <FaStar
                key={idx}
                className={idx < Math.round(avgRating) ? "text-amber-400" : "text-slate-200"}
                size={18}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 mt-2 block">Based on {totalReviews} reviews</span>
        </div>

        {/* Stars Breakdown grid */}
        <div className="md:col-span-2 p-2 flex flex-col justify-center space-y-2">
          {starCounts.map((count, index) => {
            const starValue = 5 - index;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={starValue} className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="w-12">{starValue} Stars</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review list Table */}
      <Table
        columns={columns}
        data={paginatedRatings}
        loading={loading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search reviews by name, ID, comments..."
        filters={filterConfigs}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredRatings.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Create Modal */}
      <Modal isOpen={activeModal === "create"} onClose={() => setActiveModal(null)} title="Add Customer Review">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Order Number *</label>
              <input
                type="text"
                required
                value={formOrderNum}
                onChange={(e) => setFormOrderNum(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. ORD-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={formCustomer}
                onChange={(e) => setFormCustomer(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating (1 to 5) *</label>
            <select
              value={formStars}
              onChange={(e) => setFormStars(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 Stars - Outstanding</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Satisfactory</option>
              <option value={2}>2 Stars - Substandard</option>
              <option value={1}>1 Star - Very Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Review Feedback Comments *</label>
            <textarea
              required
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us what you thought about the laundry or logistics experience..."
            />
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
              Submit Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}