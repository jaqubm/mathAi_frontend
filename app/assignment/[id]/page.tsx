'use client'

import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {Assignment} from "@/app/api/types";
import {getClass} from "@/app/api/class";
import {getAssignment} from "@/app/api/assignment";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import {Edit2} from "lucide-react";
import dayjs from "dayjs";

export default function AssignmentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: session } = useSession()

    const [assignment, setAssignment] = useState<Assignment>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        setLoading(true)

        getAssignment(params.id)
            .then((result) => {
                if (result.success) {
                    setAssignment(result.data)
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
    }, [params.id, session?.user?.email, refreshKey])

    console.log(assignment)

    return (
        <>
            {loading && !assignment && (
                <Spinner size="large"/>
            )}

            {!loading && assignment && (
                <div className="w-full max-w-5xl px-4 my-6">

                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-1 flex items-center">
                            {assignment.name}
                            <Edit2
                                className="ml-2 w-5 h-5 hover:w-6 hover:h-6 hover:cursor-pointer"
                                //onClick={() => setEditingClassName(cClass.name)}
                            />
                        </h1>

                        <h3 className="text-md mb-2 flex items-center">
                            {dayjs(assignment.startDate).format('YYYY.MM.DD HH:mm')} - {dayjs(assignment.dueDate).format('YYYY.MM.DD HH:mm')}
                            <Edit2
                                className="ml-2 w-4 h-4 hover:w-5 hover:h-5 hover:cursor-pointer"
                                //onClick={() => setEditingClassName(cClass.name)}
                            />
                        </h3>

                        <h2 className="text-xl">Klasa: {assignment.className}</h2>
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