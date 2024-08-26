import React from "react";
import {Vortex} from "@/components/ui/vortex";
import { Button } from "@/components/ui/button"

export default function VortexDemo() {
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
                    Work in progress!
                </p>

                <Button variant='secondary' className='mt-6'>
                    Click me!
                </Button>
            </Vortex>
        </div>
    );
}
