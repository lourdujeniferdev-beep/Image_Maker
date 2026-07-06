import React, { useState, useRef } from 'react';
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

const Upload: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match('image.*')) {
      setToast({ message: 'Please upload an image file (PNG, JPG)', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const response: any = await imageApi.uploadImage(selectedFile, (p) => setProgress(p));
      setToast({ message: response.message || 'Image uploaded successfully!', type: 'success' });
      setTimeout(() => {
        setToast(null);
        navigate('/gallery');
      }, 2000);
    } catch (err: any) {
      setToast({ message: err.message || 'Upload failed', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-4 shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container mt-5">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-secondary border-0 shadow-lg rounded-4">
              <div className="card-body p-5">
                <h3 className="fw-bold mb-1 text-center">Upload Image</h3>
                <p className="text-muted text-center mb-4">Upload your existing images to your Enterprise gallery.</p>

                {!previewUrl ? (
                  <div 
                    className={`border border-2 border-dashed rounded-4 p-5 text-center transition-all ${dragActive ? 'border-info bg-dark' : 'border-secondary bg-dark opacity-75'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="d-none" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleChange} 
                    />
                    <div className="display-4 text-muted mb-3">📁</div>
                    <h5 className="fw-bold text-light mb-2">Drag and drop your image here</h5>
                    <p className="text-muted small mb-4">Files supported: JPG, PNG, WEBP</p>
                    <button className="btn btn-outline-info fw-bold px-4 rounded-pill">Browse Files</button>
                  </div>
                ) : (
                  <div className="bg-dark rounded-4 p-4 text-center border border-secondary shadow-sm">
                    <img src={previewUrl} alt="Preview" className="img-fluid rounded-3 mb-4 shadow" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                    
                    {uploading && (
                      <div className="mb-4 text-start">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-bold text-info">Uploading...</span>
                          <span className="small fw-bold">{progress}%</span>
                        </div>
                        <div className="progress bg-secondary" style={{ height: '10px' }}>
                          <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                      <button 
                        className="btn btn-info fw-bold text-white px-5 py-2 shadow-sm rounded-pill" 
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <button 
                        className="btn btn-outline-light px-4 py-2 rounded-pill" 
                        onClick={clearSelection}
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
