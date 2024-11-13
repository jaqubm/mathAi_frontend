import {ExerciseUpdate} from "@/app/api/types";
import {AxiosError} from "axios";
import axiosInstance from "@/app/api";

export const updateExercise = async (exerciseId: string, exerciseUpdate: ExerciseUpdate) => {
    try {
        const response = await axiosInstance.put(`/Exercise/Update/${exerciseId}`, exerciseUpdate)

        return { success: true, data: response.data as string }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to update exercise.'

        return { success: false, error: errorMessage }
    }
}

export const deleteExercise = async (exerciseId: string) => {
    try {
        const response = await axiosInstance.delete(`/Exercise/Delete/${exerciseId}`)

        return { success: true, data: response.data as string }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to delete exercise.'

        return { success: false, error: errorMessage }
    }
}