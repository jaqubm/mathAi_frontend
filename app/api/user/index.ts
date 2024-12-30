import {axiosInstance} from "@/app/api";
import {UserClassList, UserExerciseSetList, User} from "@/app/api/types";

export async function getUser() {
    try {
        const { data } = await axiosInstance.get(`/User/Get`)
        return data as User
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function getUserExistsAndIsStudent(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/GetExistsAndIsStudent/${email}`)
        return data as boolean
    } catch (error) {
        console.error('Error:', error)
        return false
    }
}

export async function updateUserAccountType(isTeacher: boolean) {
    try {
        await axiosInstance.put(`/User/UpdateAccountType`, isTeacher);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getUserExerciseSetList() {
    try {
        const { data } = await axiosInstance.get(`/User/GetExerciseSetList`)
        return { success: true, data: data as UserExerciseSetList[] }
    } catch (error) {
        console.error('Error while trying to get users exercise sets:', error)
        return { success: false, error: 'Failed to get users exercise sets.' }
    }
}

export async function getUserClassList() {
    try {
        const { data } = await axiosInstance.get(`/User/GetClassList`)
        return { success: true, data: data as UserClassList[] }
    } catch (error) {
        console.error('Error while trying to get users classes:', error)
        return { success: false, error: 'Failed to get users classes.' }
    }
}
