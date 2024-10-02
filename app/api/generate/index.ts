'use client'

export const generateExerciseSet = async (exerciseSetGenerator: any) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ExerciseSet/GenerateExerciseSet`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(exerciseSetGenerator),
            signal: AbortSignal.timeout(180000),
        })

        if (response.ok) {
            const exerciseSetId = await response.text()
            return { success: true, data: exerciseSetId }
        } else {
            const error = await response.text()
            return { success: false, error: `HTTP error! Status: ${response.status} - ${error}` }
        }
    } catch (error) {
        console.error('Error generating exercise set:', error)
        return { success: false, error: 'Failed to generate exercise set.' }
    }
}