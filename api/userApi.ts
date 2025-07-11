import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

export const getToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const getAllUsers = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const getUserById = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const updateUser = async (formData: FormData, id: string) => {
  const token = getToken();
  try {
    const response = await axios.put(`${baseURL}/users/edit/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const deleteUser = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const updateProfile = async (formData: FormData) => {
  const token = getToken();

  try {
    const response = await axios.put(`${baseURL}/users/me/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating user', error);
    if (error.response && error.response.data) {
      console.error('Server error response:', error.response.data);
      throw new Error(error.response.data.message || 'Gagal update profil!');
    }

    throw new Error(error.message || 'Terjadi kesalahan saat update profil!');
  }
};
