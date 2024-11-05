'use client'

import {Spinner} from "@/components/ui/spinner";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {checkExerciseSetOwnership} from "@/app/api/exerciseset";
import {getClass} from "@/app/api/class";

export default function ClassPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: user } = useSession()

    const [cClass, setClass] = useState<any>(null)
    const [isClassOwner, setIsClassOwner] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)

        getClass(params.id)
            .then((result) => {
                if (result.success) {
                    setClass(result.data)

                    checkExerciseSetOwnership(user?.user?.email ?? "", result.data.userId)
                        .then((isOwner) => {
                            setIsClassOwner(isOwner)
                        })
                } else {
                    // @ts-ignore
                    setError(result.error)
                }
            })
            .catch((error) => {
                console.error('Error fetching exercise set:', error)
                setError('An unexpected error occurred')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [params.id, user?.user?.email])

    console.log(cClass)

    return (
        <>
            {loading && (
                <Spinner size="large"/>
            )}

            {!loading && cClass && (
                <div className="w-full max-w-5xl px-4 my-6">
                    {/* Basic exerciseSet info */}
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-2">{cClass.name}</h1>

                        <h3>Nauczyciel: {cClass.ownerId}</h3>
                    </div>

                    {/* Displaying exercises from exerciseSet */}
                    <div className="grid gap-5">
                        {cClass.classStudents.map((student: any, index: number) => (
                            <div key={student.id}>
                                {student.studentId}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Display an error message if there was an error */}
            {!loading && error && (
                <div className="text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}
        </>
    )
}