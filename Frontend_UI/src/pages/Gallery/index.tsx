import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageApi } from '../../api/imageApi';
import ImageCard from '../../components/ImageCard';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-2 z-3 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const response = await imageApi.getAllImages({ page: currentPage, search: searchQuery, sort: sortOrder });
      setImages(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load gallery", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [currentPage, sortOrder]); // Re-fetch on pagination or sort change

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    loadGallery();
  };

  const handleDelete = async (id: string) => {
    try {
      await imageApi.deleteImage(id);
      setToast({ message: 'Image deleted successfully', type: 'success' });
      setTimeout(() => setToast(null), 3000);
      loadGallery(); // Refresh list
    } catch (error) {
      setToast({ message: 'Failed to delete image', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light text-dark pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white mb-4 shadow-sm border-bottom">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <div className="d-flex gap-3">
             {/* Temporarily disabled Upload feature for future development
             <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => navigate('/upload')}>
               📤 Upload
             </button>
             */}
             <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
               ← Dashboard
             </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Image Gallery</h2>
          
          <div className="d-flex gap-2" style={{ maxWidth: '600px' }}>
            <form onSubmit={handleSearch} className="d-flex">
              <input 
                type="text" 
                className="form-control bg-white text-dark border-secondary-subtle shadow-sm rounded-start-pill px-4"
                placeholder="Search prompts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-info text-white rounded-end-pill px-3 shadow-sm border border-info">
                🔍
              </button>
            </form>

            <select 
              className="form-select bg-white text-dark border-secondary-subtle shadow-sm rounded-pill px-4"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: '150px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
             <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          </div>
        ) : images.length > 0 ? (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 mb-5">
              {images.map((image) => (
                <div className="col" key={image.id}>
                  <ImageCard image={image} onDelete={handleDelete} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Gallery pagination">
                <ul className="pagination shadow-sm">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link bg-white text-dark border-secondary-subtle" onClick={() => setCurrentPage(c => c - 1)}>
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button 
                        className={`page-link border-secondary-subtle ${currentPage === i + 1 ? 'bg-info text-white border-info' : 'bg-white text-dark'}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link bg-white text-dark border-secondary-subtle" onClick={() => setCurrentPage(c => c + 1)}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <div className="card bg-white border-0 p-5 text-center rounded-4 shadow-sm mt-5">
            <h4 className="text-dark fw-bold mb-3">No images found</h4>
            <p className="text-muted">Try a different search term or generate new images.</p>
            <div>
               <button className="btn btn-info text-white fw-bold px-4 rounded-pill mt-3" onClick={() => navigate('/generate')}>
                 Generate Images
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
