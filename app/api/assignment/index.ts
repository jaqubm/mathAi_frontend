import {Assignment, AssignmentCreator} from "@/app/api/types";
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
            : "Failed to create assignment.";

        return { success: false, error: errorMessage };
    }
}

export const getAssignment = async (assignmentId: string) => {
    try {
        const response = await axiosInstance.get(`/Assignment/Get/${assignmentId}`)

        return { success: true, data: response.data as Assignment }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to get assignment.";

        return { success: false, error: errorMessage };
    }
}

export const updateAssignmentName = async (assignmentId: string, assignmentName: string) => {
    try {
        const response = await axiosInstance.put(`/Assignment/UpdateName/${assignmentId}`, assignmentName);

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to update assignment name.";

        return { success: false, error: errorMessage };
    }
}

export const deleteAssignment = async (assignmentId: string) => {
    try {
        const response = await axiosInstance.delete(`/Assignment/Delete/${assignmentId}`)

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to delete assignment.";

        return { success: false, error: errorMessage };
    }
}
