import {AssignmentCreator} from "@/app/api/types";
import axios, {AxiosError} from "axios";
import axiosInstance from "@/app/api";

export const createAssignment = async (assignmentCreator: AssignmentCreator) => {
    try {
        const response = await axiosInstance.post('/Assignment/Create', assignmentCreator)

        return { success: true, data: response.data as string }

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