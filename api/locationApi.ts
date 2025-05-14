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

export const getAllProvinces = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/provinces`, {
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

export const getProvinceRegency = async (id: number) => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/provinces/${id}/regencies`, {
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
