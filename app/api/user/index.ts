import axios from 'axios';
import {axiosInstance} from "@/app/api";

export async function FirstTimeSignIn(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/FirstTimeSignIn/${email}`)
        return data === "true"
    } catch (error) {
        console.error('Error:', error)
        return false
    }
}

export async function IsTeacher(email: string) {
    if (!email) return false

    try {
        const { data } = await axiosInstance.get(`/User/IsTeacher/${email}`)
        return data === "true"
    } catch (error) {
        console.error('Error:', error)
        return false
    }
}

export async function UpdateToTeacher(email: string) {
    if (!email) return

    try {
        await axiosInstance.put(`/User/UpdateToTeacher/${email}`)
    } catch (error) {
        console.error('Error:', error)
    }
}

export async function UpdateToStudent(email: string) {
    if (!email) return

    try {
        await axiosInstance.put(`/User/UpdateToStudent/${email}`)
    } catch (error) {
        console.error('Error:', error)
    }
}

export async function GetUserExerciseSets(email: string) {
    if (!email) return { success: false, error: 'Email is missing!' }

    try {
        const { data } = await axiosInstance.get(`/User/GetExerciseSets/${email}`)
        const sortedExerciseSets = data.sort((a: any, b: any) => a.name.localeCompare(b.name))
        return { success: true, data: sortedExerciseSets }
    } catch (error) {
        console.error('Error while trying to get users exercise sets:', error)
        return { success: false, error: 'Failed to get users exercise sets.' }
    }
}
