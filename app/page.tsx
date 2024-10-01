'use client'

import React from "react";
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation";

export default function HomePage() {
    return (
        <>
            <h1 className="md:text-6xl text-4xl font-bold text-center py-6">mathAi</h1>
            <p className="text-sm md:text-2xl max-w-xl mt-6 text-center">Work in progress!</p>
        </>
    );
}
