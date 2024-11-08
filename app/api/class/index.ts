import {axiosInstance} from "@/app/api";
import axios, {AxiosError} from "axios";
import {ClassCreator} from "@/app/api/types";

export const createClass = async (cClass: ClassCreator) => {
    try {
        const response = await axiosInstance.post('/Class/Create', cClass)

        return { success: true, data: response.data }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to create class.";

        return { success: false, error: errorMessage };
    }
}

export const getClass = async (classId: string) => {
    try {
        const response = await axiosInstance.get(`/Class/Get/${classId}`);

        return { success: true, data: response.data }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to get class.";

        return { success: false, error: errorMessage };
    }
}