import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageApi } from '../../api/imageApi';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-0 z-3 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const ImageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchImage = async () => {
      try {
        if (id) {
          const data = await imageApi.getImageById(id);
          setImage(data);
        }
      } catch (error) {
        setToast({ message: 'Failed to load image details', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id, user, navigate]);

  const handleDownload = () => {
    if (image) {
      window.open(image.url, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to permanently delete this image?')) return;
    
    try {
      await imageApi.deleteImage(id);
      setToast({ message: 'Image deleted successfully. Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate('/gallery');
      }, 1500);
    } catch (error) {
      setToast({ message: 'Failed to delete image', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-dark text-light pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-4 shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => navigate('/gallery')}>
            ← Back to Gallery
          </button>
        </div>
      </nav>

      <div className="container mt-5">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
             <div className="spinner-border text-info" style={{ width: '4rem', height: '4rem' }} role="status"></div>
          </div>
        ) : image ? (
          <div className="row g-5">
            {/* Left Side: Large Image Preview */}
            <div className="col-lg-7">
              <div className="card bg-secondary border-0 shadow-lg rounded-4 overflow-hidden h-100">
                <div className="card-body p-0 d-flex align-items-center justify-content-center bg-dark" style={{ minHeight: '600px' }}>
                  <img 
                    src={image.url} 
                    alt={image.prompt} 
                    className="img-fluid" 
                    style={{ maxHeight: '80vh', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Metadata and Actions */}
            <div className="col-lg-5">
              <div className="card bg-secondary text-light border-0 shadow-lg rounded-4 h-100">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4 border-bottom border-dark pb-3">Image Details</h3>
                  
                  <div className="mb-4">
                    <h6 className="text-muted text-uppercase fw-bold small mb-2">Prompt</h6>
                    <p className="fs-5 lead">"{image.prompt}"</p>
                  </div>

                  {image.negativePrompt && (
                    <div className="mb-4">
                      <h6 className="text-muted text-uppercase fw-bold small mb-2">Negative Prompt</h6>
                      <p className="text-light opacity-75">{image.negativePrompt}</p>
                    </div>
                  )}

                  <div className="row g-3 mb-5 bg-dark p-3 rounded-4 border border-secondary">
                    <div className="col-6">
                      <p className="text-muted small mb-1">Created Date</p>
                      <p className="fw-medium mb-0">{image.date}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted small mb-1">Model</p>
                      <p className="fw-medium mb-0">{image.model}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted small mb-1">Dimensions</p>
                      <p className="fw-medium mb-0">{image.size || `${image.settings.width}x${image.settings.height}`}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted small mb-1">Seed</p>
                      <p className="fw-medium mb-0">{image.settings?.seed || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted small mb-1">Steps</p>
                      <p className="fw-medium mb-0">{image.settings?.steps || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted small mb-1">CFG Scale</p>
                      <p className="fw-medium mb-0">{image.settings?.cfgScale || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="d-grid gap-3">
                    <button className="btn btn-info text-white fw-bold py-3 shadow-sm rounded-pill" onClick={handleDownload}>
                      ⬇️ Download High-Res
                    </button>
                    <div className="row g-3">
                      <div className="col-6">
                        <button className="btn btn-outline-light w-100 py-2 rounded-pill" onClick={() => {
                          navigator.clipboard.writeText(image.prompt);
                          setToast({ message: 'Prompt copied!', type: 'success' });
                          setTimeout(() => setToast(null), 2000);
                        }}>
                          📋 Copy Prompt
                        </button>
                      </div>
                      <div className="col-6">
                        <button className="btn btn-outline-danger w-100 py-2 rounded-pill" onClick={handleDelete}>
                          🗑️ Delete Image
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-5">
            <h3 className="text-muted">Image not found</h3>
            <button className="btn btn-info text-white mt-3" onClick={() => navigate('/gallery')}>Return to Gallery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDetails;
