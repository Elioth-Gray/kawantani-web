import axios from "axios";
import {
  TCreateWorkshopRequest,
  TWorkshopResponse,
  TWorkshopDetailResponse,
  TWorkshopVerificationRequest,
} from "@/types/workshopTypes";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2000/api";

export const getToken = () => {
  const token = localStorage.getItem("accessToken");
  return token;
};

export const getAllWorkshops = async (): Promise<TWorkshopResponse> => {
  try {
    const response = await axios.get(`${baseURL}/workshops`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const getWorkshopById = async (
  id: string
): Promise<TWorkshopDetailResponse> => {
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const createWorkshop = async (
  formData: FormData
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(`${baseURL}/workshops/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const verifyWorkshop = async (
  data: TWorkshopVerificationRequest
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${baseURL}/workshops/${data.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const deleteWorkshop = async (
  id: string
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.delete(`${baseURL}/workshops/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};
