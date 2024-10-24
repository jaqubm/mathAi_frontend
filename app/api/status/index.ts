'use client'

import {axiosInstance} from "@/app/api"

export const wakeUpDatabase = async () => {
    try {
        const { data } = await axiosInstance.get(`Api/WakeUpDatabase`)

        return data
    } catch (error) {
        return false
    }
}

export const getApiStatus = async () => {
    try {
        const { data } = await axiosInstance.get('/Api/Status')

        return data
    } catch (error) {
        return {
            apiStatus: "Failed",
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}