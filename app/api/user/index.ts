import {axiosInstance} from "@/app/api";

export interface User {
    email: string
    name: string
    isTeacher: boolean
    firstTimeSignIn: boolean
}

export interface ExerciseSet {
    id: string
    name: string
    schoolType: string
    grade: string
    subject: string
}

export interface Class {
    id: string
    name: string
    owner: User
}

export async function getUser() {
    try {
        const { data } = await axiosInstance.get(`/User/Get`)
        return data as User
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export async function getUserExist(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/Exist/${email}`)
        return data === true
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
        return { success: true, data: data as [ExerciseSet] }
    } catch (error) {
        console.error('Error while trying to get users exercise sets:', error)
        return { success: false, error: 'Failed to get users exercise sets.' }
    }
}

export async function getUserClassList() {
    try {
        const { data } = await axiosInstance.get(`/User/GetClassList`)
        return { success: true, data: data as [Class] }
    } catch (error) {
        console.error('Error while trying to get users classes:', error)
        return { success: false, error: 'Failed to get users classes.' }
    }
}
