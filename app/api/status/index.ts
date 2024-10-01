'use server'

export const getApiStatus = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status`, {
            cache: "no-cache",
            signal: AbortSignal.timeout(60000),
        })

        if (!response.ok) {
            return {
                apiStatus: "Failed",
                databaseConnectionStatus: "Failed",
                openAiApiConnectionStatus: "Failed",
            }
        }

        return await response.json()
    } catch (e) {
        return {
            apiStatus: "Failed",
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}