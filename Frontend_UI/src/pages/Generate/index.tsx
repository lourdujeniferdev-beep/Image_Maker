import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageApi } from '../../api/imageApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Toast = ({ message, type }: { message: string; type: 'success' | 'danger' }) => (
  <div className={`toast show position-fixed top-0 end-0 m-3 align-items-center text-bg-${type} border-3 z-5 shadow`} role="alert">
    <div className="d-flex">
      <div className="toast-body fw-medium">{message}</div>
    </div>
  </div>
);

const Generate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('stable-diffusion-xl');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState('');
  const [imageCount, setImageCount] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }
    
    setError('');
    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await imageApi.generateImage({
        prompt, negativePrompt, model, width, height, steps, cfgScale, seed, imageCount
      });
      setGeneratedImage(response);
      setToast({ message: 'Image generated and automatically saved!', type: 'success' });
      
      // Clear form logic as per requirements
      setPrompt('');
      setNegativePrompt('');
    } catch (err: any) {
      setToast({ message: err.message || 'Generation failed', type: 'danger' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setNegativePrompt('');
    setSeed('');
    setError('');
  }

  // Right Panel actions
  const handleDownload = () => {
    if (generatedImage) {
      window.open(generatedImage.url, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage.prompt);
      setToast({ message: 'Prompt copied to clipboard!', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-vh-100 bg-light text-dark pb-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white mb-4 shadow-sm border-bottom">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-info" href="#" onClick={() => navigate('/dashboard')}>Enterprise ImageGen</a>
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container-fluid px-4">
        {toast && <Toast message={toast.message} type={toast.type} />}
        
        <div className="row g-4">
          {/* Left Panel: Settings Form */}
          <div className="col-lg-4 col-md-5">
            <div className="card bg-white text-dark border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 border-bottom pb-2">Generation Parameters</h5>
                
                <form onSubmit={handleGenerate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Prompt <span className="text-danger">*</span></label>
                    <textarea 
                      className={`form-control bg-light text-dark border-secondary-subtle ${error ? 'is-invalid' : ''}`}
                      rows={4}
                      placeholder="Describe what you want to see... (e.g., 'A futuristic city in the clouds, cyberpunk style')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                    {error && <div className="invalid-feedback">{error}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">Negative Prompt</label>
                    <textarea 
                      className="form-control bg-light text-dark border-secondary-subtle"
                      rows={2}
                      placeholder="What to exclude (e.g., blurry, low quality, distorted)"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                    ></textarea>
                  </div>

                  {/* <div className="mb-4">
                    <label className="form-label text-muted">Model Selection</label>
                    <select 
                      className="form-select bg-light text-dark border-secondary-subtle"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      <option value="stable-diffusion-xl">Stable Diffusion XL</option>
                      <option value="dall-e-3">DALL-E 3</option>
                      <option value="midjourney-v6">Midjourney v6</option>
                    </select>
                  </div> */}

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="form-label text-muted small mb-1">Width</label>
                      <input type="number" className="form-control form-control-sm bg-light text-dark border-secondary-subtle" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small mb-1">Height</label>
                      <input type="number" className="form-control form-control-sm bg-light text-dark border-secondary-subtle" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="form-label text-muted small mb-1">Steps: <span className="text-dark fw-bold">{steps}</span></label>
                      <input type="range" className="form-range" min="10" max="150" value={steps} onChange={(e) => setSteps(Number(e.target.value))} />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small mb-1">CFG Scale: <span className="text-dark fw-bold">{cfgScale}</span></label>
                      <input type="range" className="form-range" min="1" max="20" step="0.5" value={cfgScale} onChange={(e) => setCfgScale(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="row g-3 mb-5">
                    <div className="col-8">
                      <label className="form-label text-muted small mb-1">Seed (Optional)</label>
                      <input type="text" className="form-control form-control-sm bg-light text-dark border-secondary-subtle" placeholder="Random" value={seed} onChange={(e) => setSeed(e.target.value)} />
                    </div>
                    <div className="col-4">
                      <label className="form-label text-muted small mb-1">Count</label>
                      <input type="number" className="form-control form-control-sm bg-light text-dark border-secondary-subtle" min="1" max="4" value={imageCount} onChange={(e) => setImageCount(Number(e.target.value))} />
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-info fw-bold text-white flex-grow-1 py-3 shadow-sm rounded-3" disabled={loading}>
                      {loading ? (
                         <><span className="spinner-border spinner-border-sm me-2" role="status"></span> Generating...</>
                      ) : (
                         '✨ Generate Image'
                      )}
                    </button>
                    <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={handleClear} disabled={loading}>
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Panel: Output Display */}
          <div className="col-lg-8 col-md-7">
             <div className="card bg-white text-dark border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
               <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '650px' }}>
                 
                 {loading ? (
                    <div className="text-center my-auto">
                      <div className="spinner-border text-info mb-4" style={{ width: '4rem', height: '4rem', borderWidth: '0.3rem' }} role="status"></div>
                      <h4 className="fw-bold text-dark mb-2">Dreaming up your image...</h4>
                      <p className="text-muted">Analyzing prompt and applying parameters. This takes a few seconds.</p>
                    </div>
                 ) : generatedImage ? (
                    <div className="w-100 h-100 d-flex flex-column align-items-center">
                      <div className="position-relative w-100 bg-light rounded-4 overflow-hidden shadow-sm mb-4 d-flex align-items-center justify-content-center border p-2" style={{ flexGrow: 1, minHeight: '500px' }}>
                         <img 
                           src={generatedImage.url} 
                           alt="Generated result" 
                           className="img-fluid rounded-3 shadow-sm" 
                           style={{ maxHeight: '600px', objectFit: 'contain' }} 
                         />
                         <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-white bg-opacity-75 border-top" style={{ backdropFilter: 'blur(10px)' }}>
                           <p className="mb-0 text-dark small fw-medium">"{generatedImage.prompt}"</p>
                           <p className="mb-0 text-info fw-bold small">Model: {generatedImage.model} • Seed: {generatedImage.settings.seed}</p>
                         </div>
                      </div>
                      
                      <div className="w-100 d-flex flex-wrap justify-content-center gap-3 mt-auto">
                         <button className="btn btn-info text-white fw-bold px-4 py-2 rounded-pill shadow-sm" onClick={handleDownload}>
                           ⬇️ Download Image
                         </button>
                         <button className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm" disabled>
                           ✓ Saved Automatically
                         </button>
                         <button className="btn btn-outline-secondary px-4 py-2 rounded-pill" onClick={handleCopyPrompt}>
                           📋 Copy Prompt
                         </button>
                         <button className="btn btn-outline-secondary px-4 py-2 rounded-pill">
                           🔗 Share Link
                         </button>
                      </div>
                    </div>
                 ) : (
                    <div className="text-center my-auto opacity-50 p-5">
                      <div className="display-1 mb-4">🎨</div>
                      <h3 className="fw-bold text-dark mb-3">No Image Generated Yet</h3>
                      <p className="text-muted">Fill out your parameters on the left panel and click <strong className="text-info">Generate Image</strong> to see the magic happen.</p>
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

export default Generate;
