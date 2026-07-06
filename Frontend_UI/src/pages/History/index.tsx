import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageApi } from '../../api/imageApi';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-0 z-3 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const History: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
    loadHistory();
  }, [user, navigate]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await imageApi.getHistory();
      setHistory(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load history', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this history record?")) return;
    try {
      await imageApi.deleteImage(id);
      setHistory(history.filter(h => h.id !== id));
      setToast({ message: 'Record deleted', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      setToast({ message: 'Failed to delete record', type: 'danger' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Success': return <span className="badge bg-success">Success</span>;
      case 'Failed': return <span className="badge bg-danger">Failed</span>;
      case 'Pending': return <span className="badge bg-warning text-dark">Pending</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (!user) return null;

  const filteredHistory = history.filter(h => h.prompt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-vh-100 bg-body text-body pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-4 shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Generation History</h2>
          <div className="d-flex gap-2">
            <input 
              type="text" 
              className="form-control bg-body-tertiary text-body border-0 shadow-sm rounded-pill px-4" 
              placeholder="Search prompts..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card bg-body-tertiary border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover table-borderless align-middle mb-0 text-body">
              <thead className="table-dark">
                <tr>
                  <th scope="col" className="px-4 py-3">Image</th>
                  <th scope="col" className="py-3">Prompt</th>
                  <th scope="col" className="py-3">Date</th>
                  <th scope="col" className="py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <div className="spinner-border text-info" role="status"></div>
                    </td>
                  </tr>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="border-bottom border-secondary">
                      <td className="px-4 py-3">
                        {item.url ? (
                          <img src={item.url} alt="thumbnail" className="rounded" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        ) : (
                          <div className="bg-secondary rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <span className="text-muted small">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 fw-medium">"{item.prompt}"</td>
                      <td className="py-3 text-muted">{item.date}</td>
                      <td className="py-3">{getStatusBadge(item.status)}</td>
                      <td className="px-4 py-3 text-end">
                        {item.status === 'Success' && (
                          <button className="btn btn-sm btn-outline-info rounded-pill me-2" onClick={() => navigate(`/gallery/${item.id}`)}>
                            View
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No history records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
