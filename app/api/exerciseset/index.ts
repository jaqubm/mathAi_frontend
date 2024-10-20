'use client'

import {AxiosError} from 'axios';
import {axiosInstance} from "@/app/api";

export const getExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await axiosInstance.get(`/ExerciseSet/Get/${exerciseSetId}`)

        return { success: true, data: response.data }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to get exercise set.'

        return { success: false, error: errorMessage }
    }
}

export const checkExerciseSetOwnership = async (currentUserId: string, exerciseSetOwnerId: string) => {
    if (!exerciseSetOwnerId)
        return false

    return currentUserId === exerciseSetOwnerId
}

export const updateExerciseSet = async (email: string, exerciseSet: any) => {
    try {
        exerciseSet.userId = email

        const response = await axiosInstance.put(
            `/ExerciseSet/Update`,
            exerciseSet,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 300000,
            })

        return { success: true, data: response.data }
    } catch (error: any | AxiosError) {
        const errorMessage = error.response?.status
            ? `HTTP error! Status: ${error.response.status}`
            : 'Failed to save exercise set.'

        return { success: false, error: errorMessage }
    }
}