'use client'

import React, {useEffect, useState} from 'react';
import {getExerciseSet, updateExerciseSet} from '@/app/api/exerciseset';
import {Spinner} from '@/components/ui/spinner';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {useSession} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {X} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {useRouter} from 'next/navigation';
import {AutosizeTextarea} from "@/components/ui/autosize-textarea";

export default function EditExerciseSetPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: user } = useSession()

    const [exerciseSet, setExerciseSet] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isSaving, setIsSaving] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    useEffect(() => {
        setLoading(true)

        getExerciseSet(params.id)
            .then((result) => {
                if (result.success) {
                    setExerciseSet(result.data)
                } else {
                    // @ts-ignore
                    setError(result.error)
                }
            })
            .catch((error) => {
                console.error('Error fetching exercise set:', error)
            })
            .finally(() => {
                setLoading(false)
            });
    }, [params.id, user?.user?.email])

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, field: string) => {
        const updatedExercises = [...exerciseSet.exercises]
        updatedExercises[index][field] = e.target.value
        setExerciseSet({ ...exerciseSet, exercises: updatedExercises })
    }

    const handleDeleteExercise = (index: number) => {
        const updatedExercises = exerciseSet.exercises.filter((_: any, i: number) => {
            return i !== index;
        });
        setExerciseSet({ ...exerciseSet, exercises: updatedExercises });
    }

    const handleSave = async () => {
        setIsSaving(true)

        const result = await updateExerciseSet(user?.user?.email ?? "", exerciseSet)

        if (result.success) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            router.push(`/exerciseset/${exerciseSet.id}`)
        } else {
            setAlertMessage(result.error || 'Failed to save the exercise set.')
            setShowAlert(true)
        }

        setIsSaving(false)
    }

    return (
        <>
            {loading && <Spinner size="large" />}

            {!loading && exerciseSet && (
                <div className="w-full max-w-5xl px-4 my-6">
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-2">{exerciseSet.name}</h1>
                        <h3>{exerciseSet.schoolType} - klasa {exerciseSet.grade}</h3>
                        <h3>{exerciseSet.subject}</h3>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div className="grid gap-5">
                            {exerciseSet.exercises.map((exercise: any, index: number) => (
                                <Card key={exercise.id} className="relative">
                                    {/* Delete button positioned absolutely to the top-right of the Card */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteExercise(index)}
                                        className="absolute top-4 right-4 text-red-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>

                                    <CardHeader>
                                        <CardTitle>Zadanie {index + 1}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <label>Treść zadania</label>
                                                <AutosizeTextarea
                                                    value={exercise.content}
                                                    onChange={(e) => handleInputChange(e, index, 'content')}
                                                    rows={3}
                                                    className="resize-none w-full mt-4"
                                                />
                                            </div>
                                            <Accordion type="multiple" className="w-full">
                                                <AccordionItem value="Podpowiedź 1">
                                                    <AccordionTrigger>Podpowiedź 1</AccordionTrigger>
                                                    <AccordionContent className="m-1">
                                                        <AutosizeTextarea
                                                            value={exercise.firstHint}
                                                            onChange={(e) => handleInputChange(e, index, 'firstHint')}
                                                            rows={2}
                                                            className="resize-none w-full"
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Podpowiedź 2">
                                                    <AccordionTrigger>Podpowiedź 2</AccordionTrigger>
                                                    <AccordionContent className="m-1">
                                                        <AutosizeTextarea
                                                            value={exercise.secondHint}
                                                            onChange={(e) => handleInputChange(e, index, 'secondHint')}
                                                            rows={2}
                                                            className="resize-none w-full"
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Podpowiedź 3">
                                                    <AccordionTrigger>Podpowiedź 3</AccordionTrigger>
                                                    <AccordionContent className="m-1">
                                                        <AutosizeTextarea
                                                            value={exercise.thirdHint}
                                                            onChange={(e) => handleInputChange(e, index, 'thirdHint')}
                                                            rows={2}
                                                            className="resize-none w-full"
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Rozwiązanie">
                                                    <AccordionTrigger>Rozwiązanie</AccordionTrigger>
                                                    <AccordionContent className="m-1">
                                                        <AutosizeTextarea
                                                            value={exercise.solution}
                                                            onChange={(e) => handleInputChange(e, index, 'solution')}
                                                            rows={3}
                                                            className="resize-none w-full"
                                                        />
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Spinner size="small" /> : 'Zapisz'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {!loading && error && (
                <div className="text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Błąd Zapisywania!</AlertDialogTitle>
                        <AlertDialogDescription>Wystąpił błąd podczas zapisywania twojego zestawu zadań!</AlertDialogDescription>
                        <AlertDialogDescription>Error message: {alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
