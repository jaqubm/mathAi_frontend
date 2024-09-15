'use server'

import {auth} from "@/auth";

export const generateExerciseSet = async (data: any) => {
    try {
        console.log('Received data on the server:', data)

        const user = await auth()

        if (user) {
            data.UserId = user.user?.email
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ExerciseSet/GenerateExerciseSet`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            const jsonResponse = await response.json()
            return { success: true, data: jsonResponse }
        } else {
            return { success: false, error: `HTTP error! Status: ${response.status}` }
        }
    } catch (error) {
        console.error('Error generating exercise set:', error)
        return { success: false, error: 'Failed to generate exercise set.' }
    }
}