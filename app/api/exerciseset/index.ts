'use client'

import axios, {AxiosError} from 'axios';

export const getExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/ExerciseSet/GetExerciseSet/${exerciseSetId}`,
            { timeout: 180000 }
        )

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