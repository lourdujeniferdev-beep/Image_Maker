import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ImageCardProps {
  image: {
    id: string;
    url: string;
    prompt: string;
    date: string;
  };
  onDelete?: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const navigate = useNavigate();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(image.url, '_blank');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this image?')) {
      onDelete(image.id);
    }
  };

  return (
    <div 
      className="card bg-secondary text-light border-0 shadow-sm h-100 transition-all" 
      style={{ transition: 'transform 0.2s', cursor: 'pointer' }} 
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} 
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      onClick={() => navigate(`/gallery/${image.id}`)}
    >
      <div className="position-relative">
        <img src={image.url} className="card-img-top rounded-top" alt={image.prompt} style={{ objectFit: 'cover', height: '220px' }} />
        
        {/* Hover Action Overlay */}
        <div 
          className="position-absolute top-0 end-0 p-2 d-flex gap-2 opacity-0 hover-opacity-100 transition-all w-100 justify-content-end bg-dark bg-opacity-50"
          onMouseEnter={(e) => e.currentTarget.classList.remove('opacity-0')}
          onMouseLeave={(e) => e.currentTarget.classList.add('opacity-0')}
        >
          <button className="btn btn-sm btn-info text-white rounded-circle shadow" onClick={handleDownload} title="Download">
            ⬇️
          </button>
          <button className="btn btn-sm btn-danger text-white rounded-circle shadow" onClick={handleDelete} title="Delete">
            🗑️
          </button>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <p className="card-text small mb-2 fw-medium flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          "{image.prompt}"
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-muted">{image.date}</small>
          <button className="btn btn-sm btn-outline-info rounded-pill px-3" onClick={(e) => { e.stopPropagation(); navigate(`/gallery/${image.id}`); }}>View</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
