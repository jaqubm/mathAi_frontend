'use client'

import React, {useEffect, useState} from "react";
import {AssignmentSubmission, ExerciseAnswerCreator} from "@/app/api/types";
import {useSession} from "next-auth/react";
import {
    addExerciseAnswerToAssignmentSubmission,
    getAssignmentSubmission,
    markAssignmentSubmissionAsCompleted
} from "@/app/api/assignmentsubmission";
import {Spinner} from "@/components/ui/spinner";
import {Button} from "@/components/ui/button";
import dayjs from "dayjs";
import {MathJax, MathJaxContext} from "better-react-mathjax";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export default function AssignmentSubmissionPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: session } = useSession()

    const [assignmentSubmission, setAssignmentSubmission] = useState<AssignmentSubmission>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [uploadingExerciseId, setUploadingExerciseId] = useState<string | null>(null)
    const [completing, setCompleting] = useState(false)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        setLoading(true)

        getAssignmentSubmission(params.id)
            .then((result) => {
                if (result.success) {
                    setAssignmentSubmission(result.data)
                } else {
                    // @ts-ignore
                    setError(result.error)
                }
            })
            .catch((error) => {
                console.error("Error fetching exercise set:", error)
                setError("An unexpected error occurred")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [params.id, session, refreshKey])

    const handleFileUpload = async (exerciseId: string, inputId: string) => {
        const inputElement = document.getElementById(inputId) as HTMLInputElement
        if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
            toast({
                title: "Błąd",
                description: "Proszę wybrać plik przed przesłaniem."
            });
            return
        }

        const file = inputElement.files[0]
        const validFileTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

        if (!validFileTypes.includes(file.type)) {
            toast({
                title: "Błąd",
                description: "Proszę przesłać plik w formacie JPG, JPEG, PNG lub PDF.",
            });
            return;
        }

        if (!assignmentSubmission) {
            toast({
                title: "Błąd",
                description: "Brak szczegółów dotyczących przesyłania zadań."
            });
            return
        }

        setUploadingExerciseId(exerciseId)

        const exerciseAnswerCreator: ExerciseAnswerCreator = {
            assignmentSubmissionId: assignmentSubmission.id,
            exerciseId,
            answerImageFile: file,
        }

        const result = await addExerciseAnswerToAssignmentSubmission(exerciseAnswerCreator)

        if (result.success) {
            toast({
                title: "Sukces",
                description: "Rozwiązanie zadania zostało przesłane pomyślnie.",
            })
            setRefreshKey((prevKey) => prevKey + 1)
        } else {
            toast({
                title: "Błąd",
                description: result.error,
            })
        }

        setUploadingExerciseId(null)
    }

    const handleCompleteSubmission = async () => {
        if (!assignmentSubmission) return

        setCompleting(true)

        const result = await markAssignmentSubmissionAsCompleted(assignmentSubmission.id)

        setCompleting(false)

        if (result.success) {
            toast({
                title: "Sukces",
                description: "Zadanie zostało pomyślnie ukończone.",
            })
            router.push("/")
        } else {
            toast({
                title: "Błąd",
                description: result.error,
            })
        }
    }

    return (
        <>
            {loading && <Spinner size="large" />}

            {!loading && assignmentSubmission && (
                <div className="w-full max-w-5xl px-4 my-6">
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-2 break-all">
                            {assignmentSubmission.assignmentName}
                        </h1>
                        <h3>
                            {dayjs(assignmentSubmission.startDate).format('YYYY.MM.DD HH:mm')} - {dayjs(assignmentSubmission.dueDate).format('YYYY.MM.DD HH:mm')}
                        </h3>
                    </div>

                    {assignmentSubmission.exerciseList.length > 0 && (
                        <div className="grid gap-5">
                            <MathJaxContext onError={ (error) => console.error(error) } >
                                {assignmentSubmission.exerciseList.map((exercise, index) => (
                                    <Card key={exercise.id} className="relative">
                                        <CardHeader>
                                            <CardTitle>Zadanie {index + 1}</CardTitle>
                                        </CardHeader>

                                        <CardContent className="whitespace-pre-wrap">
                                            <MathJax dynamic>
                                                {exercise.content}
                                            </MathJax>
                                        </CardContent>

                                        <CardFooter>
                                            {exercise.isAnswered ? (
                                                <div className="text-green-500 font-bold">
                                                    Rozwiązanie zostało już przesłane!
                                                </div>
                                            ) : (
                                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                                    <Label htmlFor={`picture_${index}`}>Twoje rozwiązanie</Label>

                                                    <div className="w-full flex items-center gap-2">
                                                        <Input
                                                            id={`picture_${index}`}
                                                            type="file"
                                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                                        />

                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleFileUpload(exercise.id, `picture_${index}`)
                                                            }
                                                            disabled={
                                                                uploadingExerciseId === exercise.id
                                                            }
                                                        >
                                                            {uploadingExerciseId === exercise.id ? (
                                                                <div className="flex gap-1.5">
                                                                    Przesyłanie.. <Spinner size="small" />
                                                                </div>
                                                            ) : (
                                                                "Prześlij"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))}
                            </MathJaxContext>
                        </div>
                    )}

                    <div className="flex justify-center mt-6 space-x-4">
                        <Button
                            variant="outline"
                            onClick={handleCompleteSubmission}
                            disabled={completing}
                        >
                            {completing ? <Spinner size="small" /> : "Zakończ"}
                        </Button>
                    </div>
                </div>
            )}

            {!loading && error && <div className="text-red-500"><p>Error: {error}</p></div>}
        </>
    )
}