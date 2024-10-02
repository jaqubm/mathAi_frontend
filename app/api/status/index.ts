'use client'

import {axiosInstance} from "@/app/api";

export const getApiStatus = async () => {
    try {
        const { data } = await axiosInstance.get('/api/status')

        return data
    } catch (error) {
        return {
            apiStatus: "Failed",
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}