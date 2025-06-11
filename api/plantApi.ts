import axios from "axios";
import { getToken } from "./authApi";
import {
  TCategory,
  TPlant,
  TUserPlant,
  TUserPlantDay,
  TUserPlantTask,
  TCreateUserPlant,
  TUpdateTaskProgress,
} from "@/types/plantTypes";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2000/api";

export const getAllCategories = async (): Promise<{
  success: boolean;
  message: string;
  data: { categories: TCategory[] };
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/categories/plants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error fetching plant categories",
      data: { categories: [] },
    };
  }
};

export const getCategoryById = async (
  id: number
): Promise<{
  success: boolean;
  message: string;
  data: { provinces: TCategory };
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/categories/plants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error fetching plant category",
      data: { provinces: {} as TCategory },
    };
  }
};

// Plants
export const getAllPlants = async (): Promise<{
  success: boolean;
  message: string;
  data: { categories: TPlant[] };
}> => {
  try {
    const response = await axios.get(`${baseURL}/plants`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error fetching plants",
      data: { categories: [] },
    };
  }
};

export const getPlantById = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: { provinces: TPlant };
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/plants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error fetching plant",
      data: { provinces: {} as TPlant },
    };
  }
};

// User Plants
export const createUserPlant = async (
  data: TCreateUserPlant
): Promise<{
  success: boolean;
  message: string;
  data: TUserPlant;
}> => {
  const token = getToken();
  try {
    const response = await axios.post(`${baseURL}/user-plants`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error creating user plant",
      data: {} as TUserPlant,
    };
  }
};

export const getUserPlants = async (): Promise<{
  message: string;
  data: TUserPlant[];
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/user-plants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      message: "Error fetching user plants",
      data: [],
    };
  }
};

export const getUserPlantDetail = async (
  id: string
): Promise<{
  message: string;
  data: TUserPlant;
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/user-plants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      message: "Error fetching user plant detail",
      data: {} as TUserPlant,
    };
  }
};

export const getUserDailyTasks = async (
  userPlantId: string,
  date?: string
): Promise<{
  message: string;
  data: TUserPlantDay[];
}> => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${baseURL}/user-plants/${userPlantId}/daily-tasks`,
      { date },
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
    return {
      message: "Error fetching daily tasks",
      data: [],
    };
  }
};

export const updateTaskProgress = async (
  data: TUpdateTaskProgress
): Promise<{
  message: string;
  data: TUserPlantTask;
}> => {
  const token = getToken();
  try {
    const response = await axios.patch(
      `${baseURL}/user-plants/${data.userPlantId}/tasks/${data.taskId}`,
      {
        doneStatus: data.doneStatus,
        user: null,
      },
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
    return {
      message: "Error updating task progress",
      data: {} as TUserPlantTask,
    };
  }
};

export const getTodayTasks = async (): Promise<{
  message: string;
  data: TUserPlantDay[];
}> => {
  const token = getToken();
  try {
    const response = await axios.get(`${baseURL}/today-tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      message: "Error fetching today tasks",
      data: [],
    };
  }
};

export const finishPlant = async (
  id: string
): Promise<{
  message: string;
  data: TUserPlant;
}> => {
  const token = getToken();
  try {
    const response = await axios.patch(
      `${baseURL}/user-plants/${id}/finish`,
      {
        user: null,
      },
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
    return {
      message: "Error finishing plant",
      data: {} as TUserPlant,
    };
  }
};
