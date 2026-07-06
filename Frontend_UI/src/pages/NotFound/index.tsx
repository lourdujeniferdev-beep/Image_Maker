import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-body text-body" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="text-center p-5">
        <h1 className="display-1 fw-bold text-info mb-0">404</h1>
        <h2 className="fw-bold mb-4">Page Not Found</h2>
        
        {/* Animated/Visual 404 placeholder */}
        <div className="mb-5 d-inline-block p-4 rounded-circle bg-body-tertiary shadow-sm">
          <div className="display-1" style={{ fontSize: '5rem' }}>🛸</div>
        </div>

        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          Oops! It seems you've wandered into the unknown. The page you're looking for doesn't exist or has been moved.
        </p>

        <button 
          className="btn btn-info text-white fw-bold px-5 py-3 rounded-pill shadow-sm fs-5 transition-all"
          onClick={() => navigate('/dashboard')}
          style={{ transition: 'transform 0.2s ease-in-out' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ← Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
