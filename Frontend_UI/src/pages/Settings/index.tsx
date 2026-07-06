import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call to save preferences
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-vh-100 bg-body text-body pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-secondary mb-5 shadow-sm border-bottom border-secondary">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Settings</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card bg-body-tertiary border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                
                <form onSubmit={handleSave}>
                  {/* Theme Section */}
                  <h5 className="fw-bold border-bottom pb-3 mb-4">Appearance</h5>
                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Theme Mode</h6>
                      <p className="small text-muted mb-0">Switch between light and dark mode</p>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="themeSwitch" 
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                      />
                      <label className="form-check-label ms-2" htmlFor="themeSwitch">
                        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </label>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <h5 className="fw-bold border-bottom pb-3 mb-4 mt-5">Preferences</h5>
                  
                  <div className="mb-4">
                    <label className="form-label fw-medium">Language</label>
                    <select 
                      className="form-select bg-body text-body" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="jp">日本語</option>
                    </select>
                  </div>

                  <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1">Email Notifications</h6>
                      <p className="small text-muted mb-0">Receive updates about your generations</p>
                    </div>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        id="notifySwitch" 
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                      />
                    </div>
                  </div>

                  <hr className="my-5" />
                  
                  <div className="d-flex justify-content-end align-items-center gap-3">
                    {saved && <span className="text-success fw-bold">✓ Preferences Saved</span>}
                    <button type="submit" className="btn btn-info text-white fw-bold px-5 rounded-pill shadow-sm" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
