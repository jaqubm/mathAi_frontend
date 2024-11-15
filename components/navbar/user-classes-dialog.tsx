'use client'

import {ReactNode, useEffect, useState} from "react";
import {getUserClassList} from "@/app/api/user";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {usePathname, useRouter} from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
import {ClassList} from "@/app/api/types";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {ToastAction} from "@/components/ui/toast";
import {deleteClass} from "@/app/api/class";
import {useToast} from "@/hooks/use-toast";

export function UserClassesDialog({ open, onClose, children }: { open: boolean, onClose: () => void, children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()

    const [classList, setClassList] = useState<ClassList[]>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
    const [isAlertDialogOpen, setAlertDialogOpen] = useState(false)

    useEffect(() => {
        if (!open) return;

        setLoading(true);

        getUserClassList()
            .then((result) => {
                if (result.success) {
                    setClassList(result.data)
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
    }, [open])

    const handleClassPageRedirect = (classId: string) => {
        onClose()
        router.push(`/class/${classId}`)
    }

    const handleDeleteClass = async () => {
        if (!selectedClassId) return

        try {
            const result = await deleteClass(selectedClassId)

            if (result.success) {
                if (pathname === `/class/${selectedClassId}`) {
                    router.push("/")
                }

                setClassList((prev) =>
                    prev ? prev.filter((singleClass) => singleClass.id !== selectedClassId) : []
                )

                toast({
                    title: "Klasa usunięta",
                    description: "Klasa została pomyślnie usunięta.",
                })
            } else {
                toast({
                    title: "Błąd usuwania",
                    description: "Nie udało się usunąć klasy.",
                    action: <ToastAction altText="Zamknij">OK</ToastAction>
                })
            }
        } catch (e) {
            console.error("Error deleting exercise set:", e)
            toast({
                title: "Błąd usuwania",
                description: "Wystąpił niespodziewany błąd podczs próby usuwania klasy!",
                action: <ToastAction altText="Zamknij">OK</ToastAction>
            })
        }
        setSelectedClassId(null)
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
                    {loading && <Spinner size="large"/>}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {!loading && !error && classList && classList.length < 1 && (
                        <p>Twoja lista klas jest pusta!</p>
                    )}
                    {!loading && classList && (
                        <div className="grid gap-4">
                            {classList.map((singleClass) => (
                                <Card key={singleClass.id}>
                                    <CardHeader>
                                        <CardTitle className="break-all">{singleClass.name}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <h3>Właściciel: {singleClass.owner.name}</h3>
                                    </CardContent>

                                    <CardFooter className="gap-x-2">
                                        <Button variant="outline" onClick={() => handleClassPageRedirect(singleClass.id)}>
                                            Przejdź
                                        </Button>

                                        {/* Delete confirmation with AlertDialog */}
                                        {singleClass.isOwner && (
                                            <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" onClick={() => {
                                                        setSelectedClassId(singleClass.id)
                                                        setAlertDialogOpen(true)
                                                    }}>
                                                        Usuń
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Czy na pewno chcesz usunąć tę klasę? Tej akcji nie można cofnąć.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
                                                            Anuluj
                                                        </Button>
                                                        <Button variant="destructive" onClick={handleDeleteClass}>
                                                            Usuń
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
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
