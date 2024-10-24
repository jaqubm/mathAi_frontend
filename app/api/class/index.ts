import {axiosInstance} from "@/app/api";
import axios, {AxiosError} from "axios";

export const createClass = async (classDto: any) => {
    try {
        const response = await axiosInstance.post(
            '/Class/Create',
            classDto,
            {
                headers: { "Content-Type": "application/json" },
            }
        )

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