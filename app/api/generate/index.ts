'use client'

import axios, {AxiosError} from "axios";
import {axiosInstance} from "@/app/api";

export const generateExerciseSet = async (exerciseSetGenerator: any) => {
    try {
        const response = await axiosInstance.post(
            '/ExerciseSet/GenerateExerciseSet',
            exerciseSetGenerator,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 300000,
            }
        )

        return { success: true, data: response.data }

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

export const generateAdditionalExercise = async (email: string, exerciseSetId: string) => {
    try {
        const response = await axiosInstance.put(
            `/ExerciseSet/GenerateAdditionalExercise/${exerciseSetId}`,
            email,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 300000,
            }
        )

        return { success: true, data: response.data }

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