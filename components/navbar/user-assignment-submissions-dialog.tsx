'use client'

import React, {ReactNode, useEffect, useState} from "react"
import {getUserAssignmentSubmissionList} from "@/app/api/user"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {useRouter} from "next/navigation"
import {Spinner} from "@/components/ui/spinner"
import {useToast} from "@/hooks/use-toast"
import {UserAssignmentSubmissionList} from "@/app/api/types"
import {DateTime} from "@auth/core/providers/kakao";
import dayjs from "dayjs";

export function UserAssignmentSubmissionsDialog({ open, onClose, children }: { open: boolean, onClose: () => void, children: ReactNode }) {
    const router = useRouter()
    const { toast } = useToast()

    const todayTime: DateTime = new Date().toISOString()

    const [assignmentSubmissionList, setAssignmentSubmissionList] = useState<UserAssignmentSubmissionList[] | undefined>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) return

        setLoading(true)

        getUserAssignmentSubmissionList()
            .then((result) => {
                if (result.success) {
                    setAssignmentSubmissionList(result.data)
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

    const handleAssignmentSubmissionPageRedirect = (assignmentSubmissionId: string) => {
        onClose()
        router.push(`/assignment/submission/${assignmentSubmissionId}`)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {children}

            <DialogContent className="sm:max-w-[640px] max-h-[90%] max-w-[95%] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Twoje Zadania</DialogTitle>
                    <DialogDescription>
                        Tutaj znajdziesz wszystkie twoje zadania.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {loading && <Spinner size="large" />}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    {!loading && !error && assignmentSubmissionList && assignmentSubmissionList.length < 1 && (
                        <p>Twoja lista zadań jest pusta!</p>
                    )}
                    {!loading && !error && assignmentSubmissionList && (
                        <div className="grid gap-4">
                            {assignmentSubmissionList.map((assignmentSubmission) => (
                                <Card key={assignmentSubmission.id}>
                                    <CardHeader>
                                        <CardTitle className="break-all">{assignmentSubmission.assignmentName}</CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <h3>Klasa: {assignmentSubmission.className}</h3>
                                        <h3>Czas trwania: {dayjs(assignmentSubmission.startDate).format('YYYY.MM.DD HH:mm')} - {dayjs(assignmentSubmission.dueDate).format('YYYY.MM.DD HH:mm')}</h3>
                                    </CardContent>

                                    <CardFooter className="gap-x-2">
                                        {assignmentSubmission.completed && (
                                            <h1 className="text-green-500 font-bold">Rozwiązany!</h1>
                                        )}

                                        {!assignmentSubmission.completed
                                            && Date.parse(assignmentSubmission.dueDate) < Date.parse(todayTime) && (
                                                <h1 className="text-red-500 font-bold">Nie rozwiązany!</h1>
                                            )}

                                        {!assignmentSubmission.completed
                                            && Date.parse(assignmentSubmission.startDate) <= Date.parse(todayTime)
                                            && Date.parse(assignmentSubmission.dueDate) >= Date.parse(todayTime) && (
                                            <Button variant="outline" onClick={() => handleAssignmentSubmissionPageRedirect(assignmentSubmission.id)}>
                                                Rozwiąż
                                            </Button>
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
