'use client'

import { ReactNode, useEffect, useState } from "react"
import { getUserExerciseSetList } from "@/app/api/user"
import { deleteExerciseSet } from "@/app/api/exerciseset"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {usePathname, useRouter} from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ExerciseSetList } from "@/app/api/types"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"

export function UserExerciseSetsDialog({ open, onClose, children }: { open: boolean, onClose: () => void, children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()

    const [exerciseSetList, setExerciseSetList] = useState<ExerciseSetList[] | undefined>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [selectedExerciseSetId, setSelectedExerciseSetId] = useState<string | null>(null)
    const [isAlertDialogOpen, setAlertDialogOpen] = useState(false)

    useEffect(() => {
        if (!open) return

        setLoading(true)

        getUserExerciseSetList()
            .then((result) => {
                if (result.success) {
                    setExerciseSetList(result.data)
                } else {
                    // @ts-ignore
                    setError(result.error)
                }
            })
            .catch((e) => {
                setError('An unexpected error occurred')
                console.error(e)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [open, toast])

    const handleExerciseSetPageRedirect = (exerciseSetId: string) => {
        onClose()
        router.push(`/exerciseset/${exerciseSetId}`)
    }

    const handleDeleteExerciseSet = async () => {
        if (!selectedExerciseSetId) return

        try {
            const result = await deleteExerciseSet(selectedExerciseSetId)
            if (result.success) {
                if (pathname === `/exerciseset/${selectedExerciseSetId}`) {
                    router.push("/")
                }

                setExerciseSetList((prev) =>
                    prev ? prev.filter((exerciseSet) => exerciseSet.id !== selectedExerciseSetId) : []
                )

                toast({
                    title: "Zestaw zadań usunięty",
                    description: "Zestaw zadań został pomyślnie usunięty.",
                })
            } else {
                toast({
                    title: "Błąd usuwania",
                    description: "Nie udało się usunąć zestawu zadań.",
                    action: <ToastAction altText="Zamknij">OK</ToastAction>
                })
            }
        } catch (e) {
            console.error("Error deleting exercise set:", e)
            toast({
                title: "Błąd usuwania",
                description: "Wystąpił niespodziewany błąd podczs próby usuwania zestawu zadań!",
                action: <ToastAction altText="Zamknij">OK</ToastAction>
            })
        }
        setSelectedExerciseSetId(null)
        setAlertDialogOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {children}

            <DialogContent className="sm:max-w-[640px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Zestawy Zadań</DialogTitle>
                    <DialogDescription>
                        Tutaj znajdziesz wszystkie twoje zestawy zadań.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {loading && <Spinner size="large" />}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {!loading && !error && exerciseSetList && exerciseSetList.length < 1 && (
                        <p>Twoja lista zestawów zadań jest pusta!</p>
                    )}
                    {!loading && !error && exerciseSetList && (
                        <div className="grid gap-4">
                            {exerciseSetList.map((exerciseSet) => (
                                <Card key={exerciseSet.id}>
                                    <CardHeader>
                                        <CardTitle className="break-all">{exerciseSet.name}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <h3>{exerciseSet.schoolType} - klasa {exerciseSet.grade}</h3>
                                        <h3>{exerciseSet.subject}</h3>
                                    </CardContent>

                                    <CardFooter className="gap-x-2">
                                        <Button variant="outline" onClick={() => handleExerciseSetPageRedirect(exerciseSet.id)}>
                                            Przejdź
                                        </Button>

                                        {/* Delete confirmation with AlertDialog */}
                                        <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" onClick={() => {
                                                        setSelectedExerciseSetId(exerciseSet.id)
                                                        setAlertDialogOpen(true)
                                                    }}>
                                                    Usuń
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Czy na pewno chcesz usunąć ten zestaw zadań? Tej akcji nie można cofnąć.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2">
                                                    <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                                                        Anuluj
                                                    </Button>
                                                    <Button variant="destructive" onClick={handleDeleteExerciseSet}>
                                                        Usuń
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
