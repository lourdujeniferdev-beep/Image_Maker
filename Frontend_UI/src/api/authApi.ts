import axiosInstance from './axios';

export const authApi = {
  login: async (data: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosInstance.post('/auth/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Login failed');
    }
  },

  register: async (data: any) => {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    try {
      const response = await axiosInstance.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      return response.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Registration failed');
    }
  },
  
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (e) {
      // Backend might fail if token is already invalid, just ignore
      return { message: "Logged out locally" };
    }
  },

  forgotPassword: async (email: string) => {
    // Mocked for now as backend doesn't have it
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (!email.includes('@')) throw new Error('Invalid email address');
    return { success: true, message: 'Password reset link sent to ' + email };
  },

  resetPassword: async (data: any) => {
    // Mocked for now as backend doesn't have it
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    return { success: true, message: 'Password has been reset successfully' };
  }
};
