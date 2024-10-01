'use client'

import {ReactNode, useEffect, useState} from "react";
import {GetUserExerciseSets} from "@/app/api/user";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";

export function UserExerciseSetsDialog({ email, children }: { email: string, children: ReactNode }) {
    const [exerciseSets, setExerciseSets] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!open) return;

        setLoading(true);

        GetUserExerciseSets(email)
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

    const handleNavigate = (exerciseSetId: string) => {
        setOpen(false)
        router.push(`/exerciseset/${exerciseSetId}`)
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
                    {loading && <p>Loading...</p>}
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

                                    <CardFooter>
                                        <Button variant="outline" onClick={() => handleNavigate(exerciseSet.id)}>
                                            Przejdź
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
