import axios from 'axios';
import { TRegister, TLogin } from '@/types/authTypes';

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

export const registerAccount = async (formData: TRegister) => {
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
    console.log(response.data.data.token);
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
    console.log(response.data.data.token);
    putToken(response.data.data.token);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};
