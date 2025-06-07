import axios from "axios";
import {
  TCreateWorkshopRequest,
  TWorkshopResponse,
  TWorkshopDetailResponse,
  TWorkshopVerificationRequest,
  TVerifiedWorkshopResponse,
  TRegisterWorkshopRequest,
  TRegisterWorkshopResponse,
  TPayWorkshopRequest,
  TPayWorkshopResponse,
} from "@/types/workshopTypes";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2000/api";

export const getToken = () => {
  const token = localStorage.getItem("accessToken");
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

export const createWorkshop = async (formData: FormData) => {
  const token = getToken();

  if (!token) {
    throw new Error("Token tidak ditemukan. Silakan login ulang.");
  }

  try {
    const response = await axios.post(`${baseURL}/workshops/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Create article response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating article:", error);
    if (error.response && error.response.data) {
      console.error("Server error response:", error.response.data);
      throw new Error(error.response.data.message || "Gagal membuat artikel");
    }

    throw new Error(error.message || "Terjadi kesalahan saat membuat artikel");
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
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

export const verifyWorkshop = async (id: string, status: string) => {
  const token = getToken();
  try {
    const response = await axios.put(
      `${baseURL}/workshops/${id}`,
      { status: status },
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
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
    return { success: false, message: "Terjadi Kesalahan!", data: null };
  }
};

export const registerWorkshop = async (
  id: string,
  data: Omit<TRegisterWorkshopRequest, "id">
): Promise<TRegisterWorkshopResponse> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/workshops/${id}/register`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Terjadi kesalahan saat mendaftar workshop",
      data: null,
    };
  }
};

export const payWorkshopRegistration = async (
  data: TPayWorkshopRequest
): Promise<TPayWorkshopResponse> => {
  const token = getToken();
  try {
    const response = await axios.patch(`${baseURL}/workshops/${id}/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Terjadi kesalahan saat melakukan pembayaran",
      data: null,
    };
  }
};
