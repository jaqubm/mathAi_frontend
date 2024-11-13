'use client'

import axios, {AxiosError} from 'axios';
import {axiosInstance} from "@/app/api";
import {ExerciseSet, ExerciseSetSettings} from "@/app/api/types";

export const generateExerciseSet = async (exerciseSetSettings: ExerciseSetSettings) => {
    try {
        const response = await axiosInstance.post(
            '/ExerciseSet/Generate',
            exerciseSetSettings,
            { timeout: 300000 }
        )

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to generate exercise set.";

        return { success: false, error: errorMessage };
    }
}

export const generateAdditionalExercise = async (exerciseSetId: string) => {
    try {
        const response = await axiosInstance.put(`/ExerciseSet/GenerateAdditionalExercise/${exerciseSetId}`, { timeout: 300000 })

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to generate additional exercise.";

        return { success: false, error: errorMessage };
    }
}

export const copyExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await axiosInstance.put(`/ExerciseSet/Copy/${exerciseSetId}`, { timeout: 300000 })

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to copy exercise set.";

        return { success: false, error: errorMessage };
    }
}

export const getExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await axiosInstance.get(`/ExerciseSet/Get/${exerciseSetId}`)

        return { success: true, data: response.data as ExerciseSet }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to get exercise set.'

        return { success: false, error: errorMessage }
    }
}

export const updateExerciseSetName = async (exerciseSetId: string, exerciseSetName: string) => {
    try {
        const response = await axiosInstance.put(`/ExerciseSet/UpdateName/${exerciseSetId}`, exerciseSetName)

        return { success: true, data: response.data as string }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to update exercise set name.'

        return { success: false, error: errorMessage }
    }
}

export const deleteExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await axiosInstance.delete(`/ExerciseSet/Delete/${exerciseSetId}`)

        return { success: true, data: response.data as string }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to delete exercise set.'

        return { success: false, error: errorMessage }
    }
}