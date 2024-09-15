'use client'

import React from "react";
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";

export default function HomePage() {
    return (
        <div className="w-full mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">
            <h1 className="md:text-6xl font-bold text-center">
                mathAi
            </h1>

            <p className="text-sm md:text-2xl max-w-xl mt-6 text-center">
                Work in progress!
            </p>
        </div>
    );
}
