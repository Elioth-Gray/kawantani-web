import {
  TRegisterFacilitator,
  TUpdateFacilitator,
} from '@/types/facilitatorTypes';
import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

export const putToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const getAllFacilitator = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/facilitator`, {
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

export const getFacilitatorById = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/facilitator/${id}`, {
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

export const createFacilitator = async (formData: FormData) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/facilitator/register`,
      formData,
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

export const deleteFacilitator = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/facilitator/${id}`, {
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

export const updateFacilitator = async (id: string, formData: FormData) => {
  const token = getToken();
  try {
    const response = await axios.put(`${baseURL}/facilitator/${id}`, formData, {
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
