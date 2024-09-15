'use client'

import {GenerateForm} from "@/components/generate/generate-form";

export default function GeneratePage() {
    return (
        <div className="w-full mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full max-w-7xl">
                <GenerateForm />
            </div>
        </div>
    )
}