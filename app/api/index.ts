import axios from "axios";
import {getSession} from "next-auth/react";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
    },
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession()

        if (session?.idToken) config.headers.Authorization = `Bearer ${session.idToken}`

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance