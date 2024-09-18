'use client'

import {useEffect, useState} from "react";
import {MultiStepLoader} from "@/components/ui/multi-step-loader";
import {checkExerciseSetOwnership, getExerciseSet} from "@/app/api/exerciseset";

const loadingStates = [
    { text: "Łączenie z serwerem..." },
    { text: "Pobieranie danych z serwera..." },
    { text: "Przygotowywanie twojego zestawu zadań..." },
]

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
    }, [params.id]);

    console.log(isExerciseSetOwner)

    return (
        <>
            {/* Multi-Step Loader */}
            <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={1000} />

            {/* Display data once loading is done */}
            {!loading && exerciseSet && (
                <div>
                    <h1 className="text-xl font-bold">Exercise Set ID: {params.id}</h1>
                    <p>{JSON.stringify(exerciseSet)}</p> {/* Render the exercise set data */}
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
