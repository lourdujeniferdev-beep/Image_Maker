import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-0 z-3 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;

    setLoading(true);
    try {
      const response = await authApi.resetPassword({ newPassword, confirmPassword });
      setToast({ message: response.message + ' Redirecting...', type: 'success' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setToast({ message: err.message || 'Reset failed', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-body text-body" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="card bg-body-tertiary text-body p-4 p-md-5 shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <div className="display-4 mb-3">🔑</div>
          <h3 className="fw-bold text-info">Reset Password</h3>
          <p className="text-muted small">Please enter your new password below.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">New Password</label>
            <input 
              type="password" 
              className="form-control bg-body text-body border-secondary px-3 py-2"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-medium">Confirm New Password</label>
            <input 
              type="password" 
              className="form-control bg-body text-body border-secondary px-3 py-2"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-info w-100 fw-bold text-white mb-4 py-2 shadow-sm rounded-pill" disabled={loading}>
            {loading ? (
               <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Updating...</>
            ) : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
