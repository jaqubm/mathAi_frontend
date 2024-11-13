'use client'

import {Spinner} from "@/components/ui/spinner";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {getClass} from "@/app/api/class";
import {AssignmentList, Class, User} from "@/app/api/types";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";

export default function ClassPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: session } = useSession()

    const [cClass, setClass] = useState<Class>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)

        getClass(params.id)
            .then((result) => {
                if (result.success) {
                    setClass(result.data)
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
    }, [params.id, session?.user?.email])

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

                        <h3>Nauczyciel: {cClass.owner.name}</h3>
                    </div>

                    {/* Displaying exercises from exerciseSet */}
                    <div className="w-full flex md:flex-row flex-col justify-center items-center gap-2">

                        <Card className="flex-1 w-full">
                            <CardHeader>
                                <CardTitle>Studenci</CardTitle>
                            </CardHeader>

                            <CardContent>

                                {cClass.students.length === 0 && (
                                    <div>
                                        Lista studnetów jest pusta!
                                    </div>
                                )}

                                {cClass.students.length > 0 && (
                                    <ScrollArea className="max-h-80 overflow-y-scroll">
                                        <ul>
                                            {cClass.students.map((student: User, index: number) => (
                                                <div key={student.email}>
                                                    <div>
                                                        <li className="font-bold">{student.name}</li>
                                                        <p className="text-sm">
                                                            {student.email}
                                                        </p>
                                                    </div>
                                                    {index !== cClass.students.length - 1 && <Separator className="my-2" />}
                                                </div>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                )}

                            </CardContent>

                            <CardFooter>
                                To be added..
                            </CardFooter>
                        </Card>

                        <Card className="flex-1 w-full">
                            <CardHeader>
                                <CardTitle>Zadania</CardTitle>
                            </CardHeader>

                            <CardContent>

                                {cClass.assignments.length === 0 && (
                                    <div>
                                        Lista zadań jest pusta!
                                    </div>
                                )}

                                {cClass.assignments.length > 0 && (
                                    <ScrollArea className="max-h-80 overflow-y-scroll">
                                        <ul>
                                            {cClass.assignments.map((assignment: AssignmentList, index: number) => (
                                                <div key={assignment.classId + assignment.exerciseSetId}>
                                                    <div>
                                                        <li>{assignment.name}</li>
                                                    </div>
                                                    {index !== cClass.assignments.length - 1 && <Separator className="my-2" />}
                                                </div>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                )}

                            </CardContent>

                            <CardFooter>
                                To be added..
                            </CardFooter>
                        </Card>
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