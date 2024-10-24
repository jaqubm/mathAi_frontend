'use client'

import {ReactNode, useEffect, useState} from "react";
import {getUserClasses} from "@/app/api/user";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";

export function UserClassesDialog({ email, open, onClose, children }: { email: string, open: boolean, onClose: () => void, children: ReactNode }) {
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!open) return;

        setLoading(true);

        getUserClasses(email)
            .then((result) => {
                if (result.success) {
                    setClasses(result.data)
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

    const handleClassPageRedirect = (classId: string) => {
        onClose()
        router.push(`/class/${classId}`)
    }

    const handleEditClassPageRedirect = (classId: string) => {
        onClose()
        router.push(`/class/${classId}/edit`)
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
                    {loading && <Spinner size="large"/>}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {!loading && !error && classes.length === 0 && (
                        <p>Brak klas.</p>
                    )}
                    {!loading && classes.length > 0 && (
                        <div className="grid gap-4">
                            {classes.map((singleClass) => (
                                <Card key={singleClass.id}>
                                    <CardHeader>
                                        <CardTitle>{singleClass.name}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <h3>Właściciel: {singleClass.ownerId}</h3>
                                    </CardContent>

                                    <CardFooter className="gap-x-4">
                                        <Button variant="outline" disabled onClick={() => handleClassPageRedirect(singleClass.id)}>
                                            Przejdź
                                        </Button>
                                        <Button variant="outline" disabled onClick={() => handleEditClassPageRedirect(singleClass.id)}>
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
