import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { authApi } from '../../api/authApi';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-0 z-3 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await authApi.getMe();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        setToast({ message: 'Failed to load profile data', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.updateProfile({ username, email });
      setToast({ message: 'Profile updated successfully!', type: 'success' });
      
      // Update global context with new username/email (simulated token re-issue)
      if (user) {
        login({ ...user, username, email }, localStorage.getItem('jwt_token') || '');
      }
      
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to update profile', type: 'danger' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setToast({ message: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setToast({ message: error.message || 'Failed to change password', type: 'danger' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-dark text-light pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-5 shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">My Profile</h2>
          <button className="btn btn-danger px-4 rounded-pill shadow-sm" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>

        {loading ? (
           <div className="d-flex justify-content-center my-5 py-5">
             <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status"></div>
           </div>
        ) : profile && (
          <div className="row g-4">
            
            {/* Left Column: User Card & Stats */}
            <div className="col-lg-4">
              <div className="card bg-secondary text-light border-0 shadow-lg rounded-4 mb-4">
                <div className="card-body text-center p-5">
                  <div className="position-relative d-inline-block mb-4">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${profile.username}&background=0D8ABC&color=fff&size=200`} 
                      alt={profile.username} 
                      className="rounded-circle img-thumbnail bg-dark border-secondary shadow" 
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                    />
                    <button className="btn btn-sm btn-info text-white rounded-circle position-absolute bottom-0 end-0 shadow" title="Change Avatar">
                      ✏️
                    </button>
                  </div>
                  <h4 className="fw-bold mb-1">{profile.username}</h4>
                  <p className="text-muted mb-4">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Forms */}
            <div className="col-lg-8">
              
              <div className="card bg-secondary text-light border-0 shadow-lg rounded-4 mb-4">
                <div className="card-body p-4 p-md-5">
                  <h5 className="fw-bold border-bottom border-dark pb-3 mb-4">Personal Information</h5>
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Username</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Email Address</label>
                        <input 
                          type="email" 
                          className="form-control bg-dark text-light border-secondary" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-info text-white fw-bold px-4 rounded-pill" disabled={saving}>
                      {saving ? 'Saving...' : 'Update Profile'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="card bg-secondary text-light border-0 shadow-lg rounded-4">
                <div className="card-body p-4 p-md-5">
                  <h5 className="fw-bold border-bottom border-dark pb-3 mb-4">Change Password</h5>
                  
                  <form onSubmit={handleChangePassword}>
                    <div className="mb-3">
                      <label className="form-label text-muted small">Current Password</label>
                      <input 
                        type="password" 
                        className="form-control bg-dark text-light border-secondary" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        required
                      />
                    </div>
                    
                    <div className="row g-4 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small">New Password</label>
                        <input 
                          type="password" 
                          className="form-control bg-dark text-light border-secondary" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small">Confirm New Password</label>
                        <input 
                          type="password" 
                          className="form-control bg-dark text-light border-secondary" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="btn btn-outline-info fw-bold px-4 rounded-pill" disabled={saving}>
                      {saving ? 'Updating...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
