// Mock API for Users & Profile
export const userApi = {
  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      id: '1',
      username: 'jenifer25',
      email: 'jenifer25@gmail.com',
      avatarUrl: 'https://ui-avatars.com/api/?name=Jenifer&background=0D8ABC&color=fff&size=200',
      joinDate: '2025-10-15',
      stats: {
        totalImages: 142,
        totalDownloads: 89
      }
    };
  },
  
  updateProfile: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (data.username === 'error') throw new Error("Username already taken.");
    return { success: true, message: 'Profile updated successfully' };
  },

  changePassword: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    return { success: true, message: 'Password changed successfully' };
  }
};
