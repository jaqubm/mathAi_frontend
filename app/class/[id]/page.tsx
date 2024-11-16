'use client'

import {Spinner} from "@/components/ui/spinner";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {addStudentToClass, getClass, removeStudentFromClass, updateClassName} from "@/app/api/class";
import {AssignmentList, Class, User} from "@/app/api/types";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Edit2, Plus, X} from "lucide-react";
import {toast} from "@/hooks/use-toast";
import {Label} from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

export default function ClassPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: session } = useSession()

    const [cClass, setClass] = useState<Class>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [checkingStudent, setCheckingStudent] = useState(false)
    const [studentEmail, setStudentEmail] = useState("")
    const [deletingUserFromClass, setDeletingUserFromClass] = useState<string | null>(null)
    const [editingClassName, setEditingClassName] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        setLoading(true)

        getClass(params.id)
            .then((result) => {
                if (result.success) {
                    setClass(result.data)
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
    }, [params.id, session?.user?.email, refreshKey])

    const handleSaveClassName = async () => {
        if (editingClassName !== null && cClass) {
            if (editingClassName === "") return

            const result = await updateClassName(params.id, editingClassName)

            if (result.success) {
                toast({
                    title: "Nazwa klasy została zaktualizowana",
                    description: "Zmiany w nazwie klasy zostały zapisane."
                })
                setClass({ ...cClass, name: editingClassName })
                setEditingClassName(null)
                setRefreshKey((prevKey) => prevKey + 1)
            } else {
                toast({
                    title: "Nazwa klasy nie została zaktualizowana",
                    description: result.error
                })
            }
        }
    }

    const handleAddStudent = async () => {
        setCheckingStudent(true)

        if (cClass && cClass.isOwner && studentEmail.trim()) {
            const result = await addStudentToClass(params.id, studentEmail)

            if (result.success) {
                setStudentEmail("")
                setRefreshKey((prevKey) => prevKey + 1)
                toast({
                    title: "Student został pomyślnie dodany",
                    description: `Student ${studentEmail} został pomyślnie dodany.`
                });
            } else {
                toast({
                    title: "Błąd",
                    description: `Konto ${studentEmail} nie zostało odnalezione lub jest kontem nauczyciela.`
                });
            }
        }
        setCheckingStudent(false)
    }

    const handleDeleteUserFromClass = async () => {
        if (!deletingUserFromClass || !cClass || !cClass.isOwner) return

        const result = await removeStudentFromClass(params.id, deletingUserFromClass)

        if (result.success) {
            toast({
                title: "Student został usunięty",
                description: "Student zostało pomyślnie usunięty z klasy."
            })
            setDeletingUserFromClass(null)
            setRefreshKey((prevKey) => prevKey + 1)
        } else {
            toast({
                title: "Błąd usuwania studenta",
                description: result.error
            })
        }
    }

    return (
        <>
            {loading && !cClass && (
                <Spinner size="large"/>
            )}

            {!loading && cClass && (
                <div className="w-full max-w-5xl px-4 my-6">
                    {/* Basic exerciseSet info */}
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-2">
                            {cClass.name}
                            {cClass.isOwner && (
                                <Button
                                    className="ml-2"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingClassName(cClass.name)}
                                >
                                    <Edit2 className="w-5 h-5"/>
                                </Button>
                            )}
                        </h1>

                        <h3>Nauczyciel: {cClass.owner.name}</h3>
                    </div>

                    {/* Displaying exercises from exerciseSet */}
                    <div className="w-full flex md:flex-row flex-col justify-center items-center gap-2">

                        <Card className="flex-1 w-full">
                            <CardHeader>
                                <CardTitle>Studenci</CardTitle>
                            </CardHeader>

                            <CardContent>

                                {cClass.students.length === 0 && (
                                    <div>
                                        Lista studnetów jest pusta!
                                    </div>
                                )}

                                {cClass.students.length > 0 && (
                                    <Card className="px-2">
                                        <ScrollArea className="max-h-80 overflow-y-scroll py-2">
                                            <ul>
                                                {cClass.students.map((student: User, index: number) => (
                                                    <div key={student.email}>
                                                        <div className="relative">
                                                            <li className="font-bold">{student.name}</li>
                                                            <p className="text-sm">
                                                                {student.email}
                                                            </p>

                                                            {cClass.isOwner && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-red-500 absolute right-2 top-0 bottom-0"
                                                                    onClick={() => setDeletingUserFromClass(student.email)}
                                                                >
                                                                    <X className="w-5 h-5" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {index !== cClass.students.length - 1 && <Separator className="my-2" />}
                                                    </div>
                                                ))}
                                            </ul>
                                        </ScrollArea>
                                    </Card>
                                )}

                            </CardContent>

                            {cClass.isOwner && (
                                <CardFooter className="flex flex-col items-center justify-center gap-2 w-full">
                                    <Label>Dodaj Studenta (Email)</Label>
                                    <div className="relative w-full max-w-xs">
                                        <Input
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                            placeholder="Wpisz Email studenta"
                                            maxLength={255}
                                            className="pr-10"
                                        />
                                        <Button
                                            onClick={handleAddStudent}
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto text-green-600"
                                            disabled={checkingStudent}
                                        >
                                            {checkingStudent ? (
                                                <Spinner size="small"/>
                                            ) : (
                                                <Plus className="w-5 h-5"/>
                                            )}
                                        </Button>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>

                        <Card className="flex-1 w-full">
                            <CardHeader>
                                <CardTitle>Zadania</CardTitle>
                            </CardHeader>

                            <CardContent>

                                {cClass.assignments.length === 0 && (
                                    <div>
                                        Lista zadań jest pusta!
                                    </div>
                                )}

                                {cClass.assignments.length > 0 && (
                                    <ScrollArea className="max-h-80 overflow-y-scroll">
                                        <ul>
                                            {cClass.assignments.map((assignment: AssignmentList, index: number) => (
                                                <div key={assignment.classId + assignment.exerciseSetId}>
                                                    <div>
                                                        <li>{assignment.name}</li>
                                                    </div>
                                                    {index !== cClass.assignments.length - 1 &&
                                                        <Separator className="my-2"/>}
                                                </div>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                )}

                            </CardContent>

                            <CardFooter>
                                This card is currently work in progress!
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}

            {/* Display an error message if there was an error */}
            {!loading && error && (
                <div className="text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            {editingClassName !== null && (
                <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) setEditingClassName(null) }}>
                    <DialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <DialogHeader>
                            <DialogTitle>Edytuj Nazwę Klasy</DialogTitle>
                            <DialogDescription>Wprowadź nową nazwę klasy i zapisz (maksymalnie 30 znaków).</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>Nazwa Klasy</Label>
                            <Input
                                value={editingClassName}
                                onChange={(e) => setEditingClassName(e.target.value)}
                                minLength={1}
                                maxLength={30}
                                className="resize-none w-full mt-2 p-2 border rounded"
                            />
                            <p className="text-right text-sm text-gray-500 mt-2">
                                {editingClassName.length}/30
                            </p>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setEditingClassName(null)}>Anuluj</Button>
                            <Button onClick={handleSaveClassName}>Zapisz</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {deletingUserFromClass && (
                <AlertDialog open={true} onOpenChange={() => setDeletingUserFromClass(null)}>
                    <AlertDialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
                            <AlertDialogDescription>
                                Czy na pewno chcesz usunąć to zadanie? Tej akcji nie można cofnąć.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setDeletingUserFromClass(null)}>Anuluj</Button>
                            <Button variant="destructive" onClick={handleDeleteUserFromClass}>Potwierdź</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    )
}