import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageApi } from '../../api/imageApi';
import ImageCard from '../../components/ImageCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalImages: 0, creditsRemaining: 0 });
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic route protection - redirect to login if no user
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsData, imagesData] = await Promise.all([
          imageApi.getDashboardStats(),
          imageApi.getRecentImages()
        ]);
        setStats(statsData);
        setRecentImages(imagesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light text-dark pb-5 font-monospace" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navbar directly in dashboard for now (can be moved to a Layout component later) */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white mb-5 shadow-sm border-bottom">
        <div className="container">
          <a className="navbar-brand fw-bold text-info" href="#">Enterprise ImageGen</a>
          <div className="d-flex align-items-center ms-auto">
            <span className="me-4 text-dark">
              Welcome, <span className="fw-bold text-info">{user.username}</span>!
            </span>
            <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Dashboard</h2>
        </div>

        {/* Statistics and Quick Actions Row */}
        <div className="row g-4 mb-5">
          <div className="col-md-4 col-lg-3">
            <div className="card bg-white text-dark h-100 border-0 shadow-sm rounded-4">
              <div className="card-body d-flex flex-column justify-content-center p-4">
                <h6 className="card-title text-muted text-uppercase fw-bold mb-3">Total Images Generated</h6>
                {loading ? (
                  <div className="spinner-border spinner-border-sm text-info mt-2" role="status"></div>
                ) : (
                  <h1 className="display-4 fw-bold text-info mb-0">{stats.totalImages}</h1>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-8 col-lg-9">
            <div className="card bg-white text-dark h-100 border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold">Quick Actions</h5>
                <div className="d-flex flex-wrap gap-3">
                  <button 
                    className="btn btn-info btn-lg fw-bold text-white shadow-sm flex-grow-1 px-4 py-3 rounded-3"
                    onClick={() => navigate('/generate')}
                  >
                    ✨ Generate New Image
                  </button>
                  {/* Temporarily disabled Upload feature for future development
                  <button 
                    className="btn btn-outline-info btn-lg fw-bold flex-grow-1 px-4 py-3 rounded-3"
                    onClick={() => navigate('/upload')}
                  >
                    📤 Upload Existing Image
                  </button>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Images Section */}
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h4 className="fw-bold mb-0">Recent Generations</h4>
          <button className="btn btn-link text-info text-decoration-none p-0" onClick={() => navigate('/gallery')}>
            View all →
          </button>
        </div>
        
        {loading ? (
           <div className="d-flex justify-content-center my-5 py-5">
             <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status">
               <span className="visually-hidden">Loading...</span>
             </div>
           </div>
        ) : recentImages.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {recentImages.map((image) => (
              <div className="col" key={image.id}>
                <ImageCard image={image} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card bg-white border-0 p-5 text-center rounded-4 shadow-sm">
            <p className="text-muted mb-3">No recent images found.</p>
            <div>
               <button className="btn btn-info text-white fw-bold px-4" onClick={() => navigate('/generate')}>
                 Generate your first image
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
