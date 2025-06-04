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

export const getAllWorkshopsAdmin = async (): Promise<TWorkshopResponse> => {
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

export const getVerifiedWorkshops = async () => {
  try {
    const response = await axios.get(`${baseURL}/workshops/verified`);
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

export const createWorkshopFacilitator = async (
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

export const verifyWorkshopAdmin = async (
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

export const registerWorkshop = async (
  id: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: number;
    paymentMethod: number;
  }
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/workshops/${id}/register`,
      data,
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

export const payWorkshopRegistration = async (
  ticketNumber: string
): Promise<TWorkshopDetailResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/workshops/pay`,
      { ticketNumber },
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

export const getWorkshopParticipantsFacilitator = async (): Promise<any> => {
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const getFacilitatorWorkshops = async (): Promise<TWorkshopResponse> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/workshops/facilitator`, {
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
