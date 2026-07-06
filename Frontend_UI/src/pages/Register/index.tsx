import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-0 z-3`} role="alert" aria-live="assertive" aria-atomic="true">
    <div className="d-flex">
      <div className="toast-body">
        {message}
      </div>
    </div>
  </div>
);

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!username) newErrors.username = 'Username is required';
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await authApi.register({ username, email, password, confirmPassword });
      
      setToast({ message: 'Registration successful! Redirecting...', type: 'success' });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      setToast({ message: err.message || 'Registration failed', type: 'danger' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="card bg-secondary text-light p-4 shadow-lg border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '1rem' }}>
        <h2 className="text-center fw-bold mb-1 text-info">Create Account</h2>
        <p className="text-center text-light mb-4 small">Join us and start generating images</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className={`form-control bg-dark text-light border-secondary ${errors.username ? 'is-invalid' : ''}`}
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className={`form-control bg-dark text-light border-secondary ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={`form-control bg-dark text-light border-secondary ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="btn btn-sm btn-link text-decoration-none text-light position-absolute top-50 end-0 me-2 mt-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              className={`form-control bg-dark text-light border-secondary ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="btn btn-info w-100 fw-bold text-white mb-3" disabled={loading}>
            {loading ? (
               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="text-center small">
          Already have an account?{' '}
          <Link to="/login" className="text-info text-decoration-none">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
