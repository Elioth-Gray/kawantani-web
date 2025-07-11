import axios from 'axios';
import { TLogin } from '@/types/authTypes';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

export const putToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const removeAccessToken = () => {
  localStorage.setItem('accessToken', '');
};

export const registerAccount = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, formData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const loginAccount = async (formData: TLogin) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, formData);
    putToken(response.data.data.token);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const getUserProfile = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/users/me`, {
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

export const activateUserAccount = async (code: string) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/auth/activate`,
      { verificationCode: code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const loginAdmin = async (formData: TLogin) => {
  try {
    const response = await axios.post(`${baseURL}/auth/admin/login`, formData);
    putToken(response.data.data.token);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const loginFacilitator = async (formData: TLogin) => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/facilitator/login`,
      formData,
    );
    putToken(response.data.data.token);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const validateToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return { valid: false };

  try {
    const res = await axios.get(`${baseURL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      valid: true,
      user: res.data.user,
    };
  } catch (err) {
    return { valid: false };
  }
};

export const getAdminProfile = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const res = await axios.get(`${baseURL}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const getFacilitatorProfile = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const res = await axios.get(`${baseURL}/facilitator/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};
