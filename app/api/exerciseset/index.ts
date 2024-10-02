'use client'

export const getExerciseSet = async (exerciseSetId: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ExerciseSet/GetExerciseSet/${exerciseSetId}`, {
            signal: AbortSignal.timeout(180000),
        })

        if (response.ok) {
            const exerciseSet = await response.json()
            return { success: true, data: exerciseSet }
        } else {
            const error = await response.text()
            return { success: false, error: `HTTP error! Status: ${response.status} - ${error}` }
        }
    } catch (error) {
        console.error('Error while trying to get exercise set:', error)
        return { success: false, error: 'Failed to get exercise set.' }
    }
}

export const checkExerciseSetOwnership = async (currentUserId: string, exerciseSetOwnerId: string) => {
    if (!exerciseSetOwnerId)
        return false

    return currentUserId === exerciseSetOwnerId
}