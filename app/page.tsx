'use client'

import React from "react";
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";

export default function VortexDemo() {
    const router = useRouter()

    const redirectApiStatus = () => {
        router.push('/status')
    }

    return (
        <div className="w-full mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">
            <h2 className="md:text-6xl font-bold text-center">
                mathAi
            </h2>

            <p className="text-sm md:text-2xl max-w-xl mt-6 text-center">
                Work in progress!
            </p>

            <Button variant='secondary' className='mt-6 w-fit' onClick={redirectApiStatus}>
                Status
            </Button>
        </div>
    );
}
