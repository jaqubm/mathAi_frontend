import React from "react";

import {Vortex} from "@/components/ui/vortex";

export default async function ApiStatusPage() {
    const getApiStatus = async () => {
        const response = await fetch(`${process.env.API_URL}/api/status`)
        return response.json()
    }

    const apiStatus = await getApiStatus()

    return (
        <div className="w-full mx-auto rounded-md  h-screen overflow-hidden">
            <Vortex
                backgroundColor="black"
                className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
            >
                <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
                    mathAi
                </h2>

                <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                    apiStatus: {apiStatus.apiStatus}
                </p>
            </Vortex>
        </div>
    );
}