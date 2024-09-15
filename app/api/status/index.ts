'use server'

export const getApiStatus = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status`, {
            cache: "no-cache",
        })

        if (!response.ok) {
            return new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
    } catch (e) {
        console.error(e)

        return {
            apiStatus: "Failed",
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}