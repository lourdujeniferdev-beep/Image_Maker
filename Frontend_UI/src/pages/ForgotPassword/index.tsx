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

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      setToast({ message: response.message + '. Redirecting to reset page to simulate email click...', type: 'success' });
      setEmail('');
      
      setTimeout(() => {
        const navigateFn = navigate; // capture from closure
        navigateFn('/reset-password');
      }, 2500);
    } catch (err: any) {
      setToast({ message: err.message || 'Request failed', type: 'danger' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-body text-body" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="card bg-body-tertiary text-body p-4 p-md-5 shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '1rem' }}>
        <div className="text-center mb-4">
          <div className="display-4 mb-3">🔒</div>
          <h3 className="fw-bold text-info">Forgot Password?</h3>
          <p className="text-muted small">Enter your email and we'll send you instructions to reset your password.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-medium">Email Address</label>
            <input 
              type="email" 
              className="form-control bg-body text-body border-secondary px-3 py-2"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-info w-100 fw-bold text-white mb-4 py-2 shadow-sm rounded-pill" disabled={loading}>
            {loading ? (
               <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Sending...</>
            ) : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="text-center small">
          Remember your password?{' '}
          <Link to="/login" className="text-info text-decoration-none fw-bold">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
