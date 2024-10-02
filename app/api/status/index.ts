'use client'

import axios from 'axios';

export const getApiStatus = async () => {
    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/status`, {
            timeout: 180000,
        })

        return data
    } catch (error) {
        return {
            apiStatus: "Failed",
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}