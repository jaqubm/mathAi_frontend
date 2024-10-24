import {axiosInstance} from "@/app/api";

export async function getIsFirstTimeSignIn(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/FirstTimeSignIn/${email}`)
        return data === true
    } catch (error) {
        console.error('Error:', error)
        return false
    }
}

export async function getIsTeacher(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/IsTeacher/${email}`)
        return data === true
    } catch (error) {
        console.error('Error:', error)
        return false
    }
}

export async function updateToTeacher(email: string) {
    if (!email) return

    try {
        await axiosInstance.put(`/User/UpdateToTeacher/${email}`)
    } catch (error) {
        console.error('Error:', error)
    }
}

export async function updateToStudent(email: string) {
    if (!email) return

    try {
        await axiosInstance.put(`/User/UpdateToStudent/${email}`)
    } catch (error) {
        console.error('Error:', error)
    }
}

export async function getUserExerciseSets(email: string) {
    if (!email) return { success: false, error: 'Email is missing!' }

    try {
        const { data } = await axiosInstance.get(`/User/GetExerciseSets/${email}`)
        return { success: true, data: data }
    } catch (error) {
        console.error('Error while trying to get users exercise sets:', error)
        return { success: false, error: 'Failed to get users exercise sets.' }
    }
}

export async function getUserClasses(email: string) {
    if (!email) return { success: false, error: 'Email is missing!' }

    try {
        const { data } = await axiosInstance.get(`/User/GetClasses/${email}`)
        return { success: true, data: data }
    } catch (error) {
        console.error('Error while trying to get users classes:', error)
        return { success: false, error: 'Failed to get users classes.' }
    }
}
