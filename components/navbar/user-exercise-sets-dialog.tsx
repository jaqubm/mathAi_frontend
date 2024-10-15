'use client'

import {ReactNode, useEffect, useState} from "react";
import {getUserExerciseSets} from "@/app/api/user";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";

export function UserExerciseSetsDialog({ email, children }: { email: string, children: ReactNode }) {
    const [exerciseSets, setExerciseSets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
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
        setOpen(false)
        router.push(`/exerciseset/${exerciseSetId}`)
    }

    const handleEditExerciseSetPageRedirect = (exerciseSetId: string) => {
        setOpen(false)
        router.push(`/exerciseset/${exerciseSetId}/edit`)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            {children}

            <DialogContent className="sm:max-w-[640px] max-h-[90%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Zestawy Zadań</DialogTitle>
                    <DialogDescription>
                        Tutaj znajdziesz wszystkie twoje zestawy zadań.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {loading && <Spinner size="large"/>}
                    {error && <p className="text-red-500">Error: {error}</p>}
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
