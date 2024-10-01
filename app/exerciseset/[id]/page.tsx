'use client'

import {useEffect, useState} from "react";
import {checkExerciseSetOwnership, getExerciseSet} from "@/app/api/exerciseset";
import {Spinner} from "@/components/ui/spinner";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

export default function ExerciseSetPage({ params }: { params: { id: string } }) {
    const [exerciseSet, setExerciseSet] = useState<any>(null)
    const [isExerciseSetOwner, setIsExerciseSetOwner] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)

        getExerciseSet(params.id)
            .then((result) => {
                if (result.success) {
                    setExerciseSet(result.data)

                    checkExerciseSetOwnership(result.data.userId)
                        .then((isOwner) => {
                            setIsExerciseSetOwner(isOwner)
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
    }, [params.id])

    // console.log(isExerciseSetOwner)

    return (
        <>
            {/* Multi-Step Loader */}
            {loading && (
                <Spinner size="large"/>
            )}

            {/* Display data once loading is done */}
            {!loading && exerciseSet && (
                <div className="w-full max-w-5xl px-4">
                    {/* Basic exerciseSet info */}
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-2">{exerciseSet.name}</h1>

                        <h3>{exerciseSet.schoolType} - klasa {exerciseSet.grade}</h3>
                        <h3>{exerciseSet.subject}</h3>
                    </div>

                    {/* Displaying exercises from exerciseSet */}
                    <div className="grid gap-5">
                        {exerciseSet.exercises.map((exercise: any, index: number) => (
                            <Card key={exercise.id}>
                                <CardHeader>
                                    <CardTitle>Zadanie {index + 1}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    {exercise.content}
                                </CardContent>

                                <CardFooter>
                                    <Accordion type="multiple" className="w-full">
                                        <AccordionItem value="Podpowiedź 1">
                                            <AccordionTrigger>Podpowiedź 1</AccordionTrigger>
                                            <AccordionContent>{exercise.firstHint}</AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="Podpowiedź 2">
                                            <AccordionTrigger>Podpowiedź 2</AccordionTrigger>
                                            <AccordionContent>{exercise.secondHint}</AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="Podpowiedź 3">
                                            <AccordionTrigger>Podpowiedź 3</AccordionTrigger>
                                            <AccordionContent>{exercise.thirdHint}</AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="Rozwiązanie">
                                            <AccordionTrigger>Rozwiązanie</AccordionTrigger>
                                            <AccordionContent>{exercise.solution}</AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardFooter>
                            </Card>
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
    );
}
