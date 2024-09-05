const getApiStatus = async () => {
    try {
        const response = await fetch(`${process.env.API_URL}/api/status`, {
            cache: "no-cache",
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
    }
    catch (e) {
        console.log(e)
        
        return {
            apiStatus: "Failed",
            openAIApiConnectionStatus: "Failed"
        }
    }
}

export default async function ApiStatusPage() {
    const apiStatus = await getApiStatus()

    return (
        <div className="w-full mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">
            <h2 className="text-2xl md:text-6xl font-bold text-center">
                mathAi
            </h2>

            <p className="text-sm md:text-2xl max-w-xl mt-6 text-center">
                apiStatus: {apiStatus.apiStatus}
            </p>
            <p className="text-sm md:text-2xl max-w-xl mt-6 text-center">
                openAIApiConnectionStatus: {apiStatus.openAIApiConnectionStatus}
            </p>
        </div>
    );
}