import axios from 'axios';
import {
  TUpdateArticle,
  TCommentArticle,
  TSaveArticle,
  TUnsaveArticle,
  TLikeArticle,
  TUnlikeArticle,
} from '@/types/articleTypes';
import { getToken } from './authApi';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:2000/api';

export const getAllArticles = async () => {
  try {
    const response = await axios.get(`${baseURL}/articles/active`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Terjadi Kesalahan saat mengambil semua artikel!',
      data: null,
    };
  }
};

export const getAllArticlesAdmin = async () => {
  try {
    const response = await axios.get(`${baseURL}/articles/active`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Terjadi Kesalahan saat mengambil semua artikel!',
      data: null,
    };
  }
};

export const getArticleById = async (id: string): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/articles/${id}`, {
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

export const getYourArticles = async (): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/articles/own`, {
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

export const createArticle = async (
  formData: FormData,
): Promise<TArticleResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error('Token tidak ditemukan. Silakan login ulang.');
  }

  try {
    console.log('Sending request to create article...');

    // Log FormData contents for debugging
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axios.post(`${baseURL}/articles/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Create article response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating article:', error);
    if (error.response && error.response.data) {
      console.error('Server error response:', error.response.data);
      throw new Error(error.response.data.message || 'Gagal membuat artikel');
    }

    throw new Error(error.message || 'Terjadi kesalahan saat membuat artikel');
  }
};

export const updateArticle = async (
  data: TUpdateArticle,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('content', data.content);
    formData.append('articleStatus', data.articleStatus);
    if (typeof data.image !== 'string') {
      formData.append('image', data.image);
    }

    const response = await axios.patch(
      `${baseURL}/articles/${data.id}/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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

export const verifyArticle = async (id: string): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.patch(
      `${baseURL}/articles/${id}/verify`,
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

export const toggleArticleStatus = async (
  id: string,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.patch(
      `${baseURL}/articles/${id}/toggle`,
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

export const deleteArticle = async (id: string): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/articles/${id}`, {
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

export const addComment = async (
  data: TCommentArticle,
): Promise<TArticleResponse> => {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      message: 'Token tidak ditemukan. Silakan login ulang.',
      data: null,
    };
  }

  try {
    const response = await axios.post(
      `${baseURL}/articles/${data.id}/comments`,
      {
        content: data.content,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      success: true,
      message: response.data.message || 'Komentar berhasil ditambahkan',
      data: response.data.data,
    };
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'Terjadi Kesalahan!',
      data: null,
    };
  }
};

export const saveArticle = async (
  data: TSaveArticle,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/articles/${data.id}/save`,
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

export const unsaveArticle = async (
  data: TUnsaveArticle,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/articles/${data.id}/save`, {
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

export const getSavedArticles = async (): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/articles/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Saved articles response:', response);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: 'Terjadi Kesalahan!', data: null };
  }
};

export const likeArticle = async (
  data: TLikeArticle,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/articles/${data.id}/like`,
      {
        rating: data.rating,
      },
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

export const unlikeArticle = async (
  data: TUnlikeArticle,
): Promise<TArticleResponse> => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/articles/${data.id}/like`, {
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
