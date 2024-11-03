'use client'

import {ReactNode, useEffect, useState} from "react";
import {getUserExerciseSets} from "@/app/api/user";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {deleteExerciseSet} from "@/app/api/exerciseset";

export function UserExerciseSetsDialog({ email, open, onClose, children }: { email: string, open: boolean, onClose: () => void, children: ReactNode }) {
    const [exerciseSets, setExerciseSets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!open) return;

        setLoading(true);

        getUserExerciseSets(email)
            .then((result) => {
                if (result.success) {
                    setExerciseSets(result.data)
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
            });
    }, [email, open])

    const handleExerciseSetPageRedirect = (exerciseSetId: string) => {
        onClose()
        router.push(`/exerciseset/${exerciseSetId}`)
    }

    const handleEditExerciseSetPageRedirect = (exerciseSetId: string) => {
        onClose()
        router.push(`/exerciseset/${exerciseSetId}/edit`)
    }

    const handleDeleteExerciseSet = async (exerciseSetId: string) => {
        const confirmed = window.confirm("Czy na pewno chcesz usunąć ten zestaw zadań?");
        if (!confirmed) return;

        try {
            const result = await deleteExerciseSet(email, exerciseSetId); // Call delete function from the API
            if (result.success) {
                setExerciseSets((prev) => prev.filter((set) => set.id !== exerciseSetId));
            } else {
                setError("Failed to delete the exercise set");
            }
        } catch (e) {
            console.error("Error deleting exercise set:", e);
            setError("Wystąpił niespodziewany błąd podczs próby usuwania twojego zestawu zadań!");
        }
    };

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
                    {loading && <Spinner size="large"/>}
                    {error && <p className="text-red-500 mb-4">Error: {error}</p>}
                    {!loading && !error && exerciseSets.length === 0 && (
                        <p>Brak zestawów zadań.</p>
                    )}
                    {!loading && exerciseSets.length > 0 && (
                        <div className="grid gap-4">
                            {exerciseSets.map((exerciseSet) => (
                                <Card key={exerciseSet.id}>
                                    <CardHeader>
                                        <CardTitle>{exerciseSet.name}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <h3>{exerciseSet.schoolType} - klasa {exerciseSet.grade}</h3>
                                        <h3>{exerciseSet.subject}</h3>
                                    </CardContent>

                                    <CardFooter className="gap-x-4">
                                        <Button variant="outline" onClick={() => handleExerciseSetPageRedirect(exerciseSet.id)}>
                                            Przejdź
                                        </Button>
                                        <Button variant="outline" onClick={() => handleEditExerciseSetPageRedirect(exerciseSet.id)}>
                                            Edytuj
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDeleteExerciseSet(exerciseSet.id)}>
                                            Usuń
                                        </Button>
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
