'use client'

import axios, {AxiosError} from "axios";

export const generateExerciseSet = async (exerciseSetGenerator: any) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/ExerciseSet/GenerateExerciseSet`,
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