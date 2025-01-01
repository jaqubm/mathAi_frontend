'use client'

import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";
import {Assignment, AssignmentSubmissionList, User} from "@/app/api/types";
import {getAssignment, updateAssignmentName} from "@/app/api/assignment";
import {Spinner} from "@/components/ui/spinner";
import {Edit2, Plus, X} from "lucide-react";
import dayjs from "dayjs";
import {toast} from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";

export default function AssignmentPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { data: session } = useSession()

    const [assignment, setAssignment] = useState<Assignment>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [editingAssignmentName, setEditingAssignmentName] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)

    const handleSaveAssignmentName = async () => {
        if (editingAssignmentName !== null && assignment) {
            if (editingAssignmentName === "") return

            const result = await updateAssignmentName(params.id, editingAssignmentName)

            if (result.success) {
                toast({
                    title: "Sukces",
                    description: "Nazwa klasy została zaktualizowana."
                })
                setAssignment({ ...assignment, name: editingAssignmentName })
                setEditingAssignmentName(null)
                setRefreshKey((prevKey) => prevKey + 1)
            } else {
                toast({
                    title: "Błąd",
                    description: result.error
                })
            }
        }
    }

    useEffect(() => {
        setLoading(true)

        getAssignment(params.id)
            .then((result) => {
                if (result.success) {
                    setAssignment(result.data)
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

    return (
        <>
            {loading && !assignment && (
                <Spinner size="large"/>
            )}

            {!loading && assignment && (
                <div className="w-full max-w-5xl px-4 my-6">

                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <h1 className="text-4xl font-bold mb-1 flex items-center">
                            {assignment.name}
                            <Edit2
                                className="ml-2 w-5 h-5 hover:w-6 hover:h-6 hover:cursor-pointer"
                                onClick={() => setEditingAssignmentName(assignment.name)}
                            />
                        </h1>

                        <h3 className="text-md mb-2 flex items-center">
                            {dayjs(assignment.startDate).format('YYYY.MM.DD HH:mm')} - {dayjs(assignment.dueDate).format('YYYY.MM.DD HH:mm')}
                        </h3>

                        <h2 className="text-xl">Klasa: {assignment.className}</h2>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Wyniki studentów</CardTitle>
                        </CardHeader>

                        <CardContent>

                            {assignment.assignmentSubmissionList.length === 0 && (
                                <div>
                                    Lista rozwiązań jest pusta!
                                </div>
                            )}

                            {assignment.assignmentSubmissionList.length > 0 && (
                                <Card className="px-2">
                                    <ScrollArea className="max-h-80 overflow-y-scroll py-2">
                                        <ul>
                                            {assignment.assignmentSubmissionList.map((assignmentSubmission: AssignmentSubmissionList, index: number) => (
                                                <div key={assignmentSubmission.id}>
                                                    <div className="w-full flex items-center justify-between px-2">

                                                        <div>
                                                            <li className="font-bold">{assignmentSubmission.student.name}</li>
                                                            <p className="text-sm">
                                                                {assignmentSubmission.student.email}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col items-center justify-between">
                                                            <h1 className="font-bold">Stan ukończenia</h1>
                                                            <p className="text-sm">{assignmentSubmission.completed ? "Ukończony" : "Nie ukończony"}</p>
                                                        </div>

                                                        <div className="flex flex-col items-center justify-between">
                                                            <h1 className="font-bold">Data ukończenia</h1>
                                                            <p className="text-sm">{assignmentSubmission.submissionDate ? dayjs(assignmentSubmission.submissionDate).format('YYYY.MM.DD HH:mm') : "-"}</p>
                                                        </div>

                                                        <div className="flex flex-col items-center justify-between">
                                                            <h1 className="font-bold">Wynik</h1>
                                                            <p className="text-sm">{assignmentSubmission.score * 100}%</p>
                                                        </div>

                                                    </div>
                                                    {index !== assignment.assignmentSubmissionList.length - 1 &&
                                                        <Separator className="my-2"/>}
                                                </div>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                </Card>
                            )}

                        </CardContent>
                    </Card>

                </div>
            )}

            {/* Display an error message if there was an error */}
            {!loading && error && (
                <div className="text-red-500">
                <p>Error: {error}</p>
                </div>
            )}

            {editingAssignmentName !== null && (
                <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) setEditingAssignmentName(null) }}>
                    <DialogContent className="sm:max-w-[480px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                        <DialogHeader>
                            <DialogTitle>Edytuj Nazwę Zadania</DialogTitle>
                            <DialogDescription>Wprowadź nową nazwę zadania i zapisz (maksymalnie 30 znaków).</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>Nazwa Zadania</Label>
                            <Input
                                value={editingAssignmentName}
                                onChange={(e) => setEditingAssignmentName(e.target.value)}
                                minLength={1}
                                maxLength={30}
                            />
                            <p className="text-right text-sm text-gray-500 mt-2">
                                {editingAssignmentName.length}/30
                            </p>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setEditingAssignmentName(null)}>Anuluj</Button>
                            <Button variant="outline" onClick={handleSaveAssignmentName}>Zapisz</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}