import axiosInstance from './axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || '';

export const imageApi = {
  generateImage: async (params: any) => {
    try {
      const response = await axiosInstance.post('/generate/', {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt || '',
        num_inference_steps: params.steps || 30
      });
      
      const data = response.data;
      const finalUrl = data.image_url?.startsWith('/') ? `${BACKEND_URL}${data.image_url}` : data.image_url;
      
      return {
        ...data,
        url: finalUrl,
        model: data.model_name,
        settings: { seed: params.seed || 'Random' }
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Failed to generate image');
    }
  },

  getAllImages: async () => {
    const response = await axiosInstance.get('/generate/');
    
    // The backend returns a flat list. Map URLs to include base path.
    const mappedData = response.data.map((img: any) => ({
      ...img,
      date: new Date(img.created_at).toLocaleDateString(),
      url: img.image_url?.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
      size: `${img.width}x${img.height}`,
      model: img.model_name
    }));
    
    // Mock the pagination expected by our frontend for now
    return { 
      data: mappedData, 
      totalPages: 1, 
      currentPage: 1 
    };
  },

  getImageById: async (id: string) => {
    const response = await axiosInstance.get(`/generate/${id}`);
    const img = response.data;
    return {
      ...img,
      date: new Date(img.created_at).toLocaleDateString(),
      url: img.image_url?.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
      size: `${img.width}x${img.height}`,
      model: img.model_name,
      settings: { steps: img.steps, cfgScale: 'N/A', seed: 'N/A' }
    };
  },

  deleteImage: async (id: string) => {
    const response = await axiosInstance.delete(`/generate/${id}`);
    return response.data;
  },

  uploadImage: async (file: File, progressCallback: (percent: number) => void) => {
    // Backend doesn't support manual uploads yet based on analysis, so this remains a mock
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        progressCallback(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            id: Math.random().toString(),
            url: URL.createObjectURL(file),
            message: 'Image upload mocked (backend endpoint missing)'
          });
        }
      }, 300);
    });
  },

  getHistory: async () => {
    const response = await axiosInstance.get('/generate/');
    
    const mappedData = response.data.map((img: any) => ({
      ...img,
      date: new Date(img.created_at).toLocaleDateString(),
      url: img.image_url?.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
      status: 'Success'
    }));

    return {
      data: mappedData,
      totalPages: 1,
      currentPage: 1
    };
  },

  getDashboardStats: async () => {
    try {
      const response = await axiosInstance.get('/generate/');
      return { totalImages: response.data.length, creditsRemaining: 0 };
    } catch {
      return { totalImages: 0, creditsRemaining: 0 };
    }
  },

  getRecentImages: async () => {
    try {
      const response = await axiosInstance.get('/generate/');
      const mappedData = response.data.map((img: any) => ({
        ...img,
        date: new Date(img.created_at).toLocaleDateString(),
        url: img.image_url?.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
        size: `${img.width}x${img.height}`,
        model: img.model_name
      })).sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      
      return mappedData.slice(0, 4);
    } catch {
      return [];
    }
  }
};
