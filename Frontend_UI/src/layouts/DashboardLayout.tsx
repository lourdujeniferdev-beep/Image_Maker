import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Generate', path: '/generate', icon: '✨' },
    { name: 'Gallery', path: '/gallery', icon: '🖼️' },
    // Temporarily disabled Upload feature for future development
    // { name: 'Upload', path: '/upload', icon: '📤' },
    { name: 'History', path: '/history', icon: '🕒' },
    { name: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  return (
    <div className="d-flex min-vh-100 bg-body text-body" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="bg-body-tertiary border-end border-secondary d-flex flex-column" style={{ width: '250px', transition: 'width 0.3s' }}>
        <div className="p-4 d-flex align-items-center gap-2 border-bottom border-secondary">
          <div className="bg-info rounded text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            E
          </div>
          <span className="fw-bold fs-5 text-info text-truncate">ImageGen</span>
        </div>
        
        <div className="flex-grow-1 p-3 overflow-y-auto">
          <ul className="nav nav-pills flex-column mb-auto gap-1">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <button
                  className={`nav-link w-100 text-start d-flex align-items-center gap-3 py-2 px-3 fw-medium rounded-3 ${
                    location.pathname === item.path 
                      ? 'active bg-info text-white shadow-sm' 
                      : 'text-body hover-bg-secondary'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="fs-5">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 border-top border-secondary">
          <div className="d-flex align-items-center gap-2 mb-3 px-2">
             <img src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'} className="rounded-circle" style={{ width: '40px', height: '40px' }} alt="Avatar" />
             <div className="d-flex flex-column text-truncate">
               <span className="fw-bold small">{user?.username}</span>
               <span className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</span>
             </div>
          </div>
          <button 
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Navbar */}
        <header className="bg-body-tertiary border-bottom border-secondary p-3 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-3">
             <h4 className="m-0 fw-bold">{navItems.find(n => n.path === location.pathname)?.name || 'Welcome'}</h4>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary rounded-circle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-info text-white rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/generate')}>
              + New Image
            </button>
            <img 
              src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'} 
              className="rounded-circle border border-2 border-info shadow-sm" 
              style={{ width: '40px', height: '40px', cursor: 'pointer' }} 
              alt="Profile" 
              onClick={() => navigate('/profile')}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow-1 overflow-y-auto p-4 p-lg-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
