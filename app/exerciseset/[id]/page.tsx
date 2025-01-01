'use client'

import React, {useEffect, useState} from "react"
import {copyExerciseSet, generateAdditionalExercise, getExerciseSet, updateExerciseSetName} from "@/app/api/exerciseset"
import {deleteExercise, updateExercise} from "@/app/api/exercise"
import {Spinner} from "@/components/ui/spinner"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {useSession} from "next-auth/react"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {useRouter} from "next/navigation"
import {ExerciseDetailed, ExerciseSet, ExerciseUpdate} from "@/app/api/types"
import {AutosizeTextarea} from "@/components/ui/autosize-textarea"
import {toast} from "@/hooks/use-toast"
import {Edit2, X} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {MathJax, MathJaxContext} from "better-react-mathjax";

export default function ExerciseSetPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: session } = useSession()

    const [exerciseSet, setExerciseSet] = useState<ExerciseSet>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isAddingExercise, setIsAddingExercise] = useState(false)
    const [isCopyingExerciseSet, setIsCopyingExerciseSet] = useState(false)
    const [editingExercise, setEditingExercise] = useState<ExerciseDetailed | null>(null)
    const [deletingExerciseId, setDeletingExerciseId] = useState<string | null>(null)
    const [editingExerciseSetName, setEditingExerciseSetName] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)

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
                console.error("Error fetching exercise set:", error)
                setError("An unexpected error occurred")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [params.id, session, refreshKey])

    const handleAddExercise = async () => {
        if (!exerciseSet?.isOwner) return

        setIsAddingExercise(true)

        const result = await generateAdditionalExercise(params.id)

        if (result.success) {
            setRefreshKey((prevKey) => prevKey + 1)
        } else {
            toast({
                title: "Błąd",
                description: result.error
            })
        }

        setIsAddingExercise(false)
    }

    const handleSaveExerciseChanges = async () => {
        if (editingExercise) {
            if (editingExercise.content === "") return
            if (editingExercise.firstHint === "") return
            if (editingExercise.secondHint === "") return
            if (editingExercise.thirdHint === "") return
            if (editingExercise.solution === "") return

            const exerciseUpdate: ExerciseUpdate = {
                content: editingExercise.content,
                firstHint: editingExercise.firstHint,
                secondHint: editingExercise.secondHint,
                thirdHint: editingExercise.thirdHint,
                solution: editingExercise.solution
            }

            const result = await updateExercise(editingExercise.id, exerciseUpdate)

            if (result.success) {
                toast({
                    title: "Sukces",
                    description: "Zadanie zostało zaktualizowane."
                })
                setEditingExercise(null)
                setRefreshKey((prevKey) => prevKey + 1)
            } else {
                toast({
                    title: "Błąd",
                    description: result.error
                })
            }
        }
    }

    const handleSaveExerciseSetName = async () => {
        if (editingExerciseSetName !== null && exerciseSet) {
            if (editingExerciseSetName === "") return

            const result = await updateExerciseSetName(params.id, editingExerciseSetName)

            if (result.success) {
                toast({
                    title: "Sukces",
                    description: "Nazwa zestawu zadań została zaktualizowana."
                })
                setExerciseSet({ ...exerciseSet, name: editingExerciseSetName })
                setEditingExerciseSetName(null)
                setRefreshKey((prevKey) => prevKey + 1)
            } else {
                toast({
                    title: "Błąd",
                    description: result.error
                })
            }
        }
    }

    const handleDeleteExercise = async () => {
        if (!deletingExerciseId) return

        const result = await deleteExercise(deletingExerciseId)

        if (result.success) {
            toast({
                title: "Sukces",
                description: "Zadanie zostało pomyślnie usunięte."
            })
            setDeletingExerciseId(null)
            setRefreshKey((prevKey) => prevKey + 1)
        } else {
            toast({
                title: "Błąd",
                description: result.error
            })
        }
    }

    const handleCopyExerciseSet = async () => {
        if (exerciseSet) {
            setIsCopyingExerciseSet(true)

            const result = await copyExerciseSet(params.id)

            setIsCopyingExerciseSet(false)

            if (result.success) {
                toast({
                    title: "Sukces",
                    description: "Pomyślnie utworzono kopię zestawu zadań."
                })
                router.push(`/exerciseset/${result.data}`)
            } else {
                toast({
                    title: "Błąd",
                    description: result.error
                })
            }
        }
    }

    return (
        <>
            {loading && <Spinner size="large" />}

            {!loading && exerciseSet && (
                <div className="w-full max-w-5xl px-4 my-6">
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <div className="flex justify-center items-center space-x-2">
                            <h1 className="text-4xl font-bold mb-2 break-all flex items-center">
                                {exerciseSet.name}
                                {exerciseSet.isOwner && (
                                    <Edit2
                                        className="ml-2 w-5 h-5 hover:w-6 hover:h-6 hover:cursor-pointer"
                                        onClick={() => setEditingExerciseSetName(exerciseSet.name)}
                                    />
                                )}
                            </h1>
                        </div>
                        <h3>{exerciseSet.schoolType} - klasa {exerciseSet.grade}</h3>
                        <h3>{exerciseSet.subject}</h3>
                        {exerciseSet.personalized !== "" && (
                            <h3>Personalizacja zadań: {exerciseSet.personalized}</h3>
                        )}
                    </div>

                    {exerciseSet.exerciseList.length === 0 && (
                        <div className="flex flex-col items-center justify-center mb-10 text-center font-bold gap-5">
                            {isAddingExercise ? <Spinner size="medium"/> : "Ten zestaw zadań jest pusty!"}
                        </div>
                    )}

                    {exerciseSet.exerciseList.length > 0 && (
                        <div className="grid gap-5">
                            <MathJaxContext onError={ (error) => console.error(error) } >
                                {exerciseSet.exerciseList.map((exercise, index) => (
                                    <Card key={exercise.id} className="relative">
                                        <CardHeader>
                                            <CardTitle>Zadanie {index + 1}</CardTitle>

                                            {exerciseSet.isOwner && (
                                                <div className="absolute top-5 right-5 flex items-center gap-3 m-3">
                                                    <Edit2
                                                        className="ml-2 w-4 h-4 hover:w-5 hover:h-5 hover:cursor-pointer"
                                                        onClick={() => setEditingExercise(exercise)}
                                                    />
                                                    <X
                                                        className="text-red-500 mx-2 w-5 h-5 hover:w-6 hover:h-6 hover:cursor-pointer"
                                                        onClick={() => setDeletingExerciseId(exercise.id)}
                                                    />
                                                </div>
                                            )}
                                        </CardHeader>

                                        <CardContent className="whitespace-pre-wrap">
                                            <MathJax dynamic>
                                                {exercise.content}
                                            </MathJax>
                                        </CardContent>

                                        <CardFooter>
                                            <Accordion type="multiple" className="w-full">
                                                <AccordionItem value="Podpowiedź 1">
                                                    <AccordionTrigger>Podpowiedź 1</AccordionTrigger>
                                                    <AccordionContent className="whitespace-pre-wrap">
                                                        <MathJax dynamic>
                                                            {exercise.firstHint}
                                                        </MathJax>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Podpowiedź 2">
                                                    <AccordionTrigger>Podpowiedź 2</AccordionTrigger>
                                                    <AccordionContent className="whitespace-pre-wrap">
                                                        <MathJax dynamic>
                                                            {exercise.secondHint}
                                                        </MathJax>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Podpowiedź 3">
                                                    <AccordionTrigger>Podpowiedź 3</AccordionTrigger>
                                                    <AccordionContent className="whitespace-pre-wrap">
                                                        <MathJax dynamic>
                                                            {exercise.thirdHint}
                                                        </MathJax>
                                                    </AccordionContent>
                                                </AccordionItem>
                                                <AccordionItem value="Rozwiązanie">
                                                    <AccordionTrigger>Rozwiązanie</AccordionTrigger>
                                                    <AccordionContent className="whitespace-pre-wrap">
                                                        <MathJax dynamic>
                                                            {exercise.solution}
                                                        </MathJax>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </MathJaxContext>
                        </div>
                    )}

                    {(isAddingExercise || isCopyingExerciseSet) && <Spinner size="medium" className="mt-6" />}

                    {exerciseSet.isOwner && (
                        <div className="flex justify-center mt-6 space-x-4">
                            <Button variant="outline" onClick={handleAddExercise} disabled={isAddingExercise}>Dodaj Zadanie</Button>
                        </div>
                    )}

                    {session && session.user && !exerciseSet.isOwner && (
                        <div className="flex justify-center mt-6 space-x-4">
                            <Button variant="outline" onClick={handleCopyExerciseSet} disabled={isCopyingExerciseSet}>Kopiuj Zestaw Zadań</Button>
                        </div>
                    )}
                </div>
            )}

            {!loading && error && <div className="text-red-500"><p>Error: {error}</p></div>}

            {editingExercise && (
                <Dialog open={true} onOpenChange={() => setEditingExercise(null)}>
                    <DialogContent className="w-full lg:max-w-5xl max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <DialogHeader>
                            <DialogTitle>Edytuj Zadanie</DialogTitle>
                            <DialogDescription>Wprowadź zmiany w zadaniu i zapisz.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Treść zadania</Label>
                                <AutosizeTextarea
                                    value={editingExercise.content}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, content: e.target.value })}
                                    rows={2}
                                    className="resize-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <Label>Podpowiedź 1</Label>
                                <AutosizeTextarea
                                    value={editingExercise.firstHint}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, firstHint: e.target.value })}
                                    rows={1}
                                    className="resize-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <Label>Podpowiedź 2</Label>
                                <AutosizeTextarea
                                    value={editingExercise.secondHint}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, secondHint: e.target.value })}
                                    rows={1}
                                    className="resize-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <Label>Podpowiedź 3</Label>
                                <AutosizeTextarea
                                    value={editingExercise.thirdHint}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, thirdHint: e.target.value })}
                                    rows={1}
                                    className="resize-none w-full mt-2"
                                />
                            </div>
                            <div>
                                <Label>Rozwiązanie</Label>
                                <AutosizeTextarea
                                    value={editingExercise.solution}
                                    onChange={(e) => setEditingExercise({ ...editingExercise, solution: e.target.value })}
                                    rows={3}
                                    className="resize-none w-full mt-2"
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setEditingExercise(null)}>Anuluj</Button>
                            <Button onClick={handleSaveExerciseChanges}>Zapisz</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {editingExerciseSetName !== null && (
                <Dialog open={true} onOpenChange={(isOpen) => { if(!isOpen) setEditingExerciseSetName(null) }}>
                    <DialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <DialogHeader>
                            <DialogTitle>Edytuj Nazwę Zestawu Zadań</DialogTitle>
                            <DialogDescription>Wprowadź nową nazwę zestawu i zapisz (maksymalnie 30 znaków).</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>Nazwa Zestawu Zadań</Label>
                            <Input
                                value={editingExerciseSetName}
                                onChange={(e) => setEditingExerciseSetName(e.target.value)}
                                maxLength={30}
                                className="resize-none w-full mt-2 p-2 border rounded"
                            />
                            <p className="text-right text-sm text-gray-500 mt-2">
                                {editingExerciseSetName.length}/30
                            </p>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setEditingExerciseSetName(null)}>Anuluj</Button>
                            <Button onClick={handleSaveExerciseSetName}>Zapisz</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}


            {deletingExerciseId && (
                <AlertDialog open={true} onOpenChange={() => setDeletingExerciseId(null)}>
                    <AlertDialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
                            <AlertDialogDescription>
                                Czy na pewno chcesz usunąć to zadanie? Tej akcji nie można cofnąć.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setDeletingExerciseId(null)}>Anuluj</Button>
                            <Button variant="destructive" onClick={handleDeleteExercise}>Potwierdź</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    )
}
