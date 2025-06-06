import axios from 'axios';
import {
  TCreateWorkshopRequest,
  TWorkshopResponse,
  TWorkshopDetailResponse,
  TWorkshopVerificationRequest,
  TVerifiedWorkshopResponse,
} from '@/types/workshopTypes';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

export const getToken = () => {
  const token = localStorage.getItem('accessToken');
  return token;
};

export const getAllWorkshops = async (): Promise<TWorkshopResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops`, {
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

export const getVerifiedWorkshops = async (): Promise<TVerifiedWorkshopResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/verified`, {
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

export const getOwnWorkshops = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/own`, {
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

export const getWorkshopById = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/${id}`, {
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

export const createWorkshopFacilitator = async (
  formData: FormData,
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(`${baseURL}/workshops/create`, formData, {
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

export const verifyWorkshop = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${baseURL}/workshops/${id}`,
      {},
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

export const deleteWorkshop = async (id: string) => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/participants`, {
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

export const getOwnActiveParticipants = async () => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${baseURL}/workshops/participants/active/own`,
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

export const getOwnPopularWorkshops = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/popular/own`, {
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

export const getAllSales = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/sales`, {
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

export const getAllParticipants = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/participants`, {
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
