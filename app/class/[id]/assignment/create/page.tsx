'use client'

import {useEffect, useState} from 'react'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Label} from '@/components/ui/label'
import {createAssignment} from '@/app/api/assignment'
import {toast} from '@/hooks/use-toast'
import {AssignmentCreator, ExerciseSetList} from '@/app/api/types'
import {getUserExerciseSetList} from "@/app/api/user"
import {DateTimePicker, TimePicker} from '@/components/ui/datetime-picker'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {pl} from "date-fns/locale"
import {useRouter} from "next/navigation";

export default function CreateAssignmentPage({ params }: { params: { id: string } }) {
    const router = useRouter()

    const [assignmentName, setAssignmentName] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [startTime, setStartTime] = useState<Date | undefined>()
    const [dueDate, setDueDate] = useState<Date | undefined>()
    const [dueTime, setDueTime] = useState<Date | undefined>()
    const [selectedExerciseSetId, setSelectedExerciseSetId] = useState('')

    const [exerciseSetList, setExerciseSetList] = useState<ExerciseSetList[]>([])
    const [loading, setLoading] = useState(false)
    const [fetchingExerciseSets, setFetchingExerciseSets] = useState(false)

    useEffect(() => {
        setFetchingExerciseSets(true)

        getUserExerciseSetList()
            .then((result) => {
                if (result.success) {
                    // @ts-ignore
                    setExerciseSetList(result.data)
                } else {
                    toast({
                        title: 'Błąd',
                        description: result.error,
                    })
                }
            })
            .catch((error) => {
                console.error('Error fetching exercise sets:', error)
                toast({
                    title: 'Błąd',
                    description: 'Wystąpił niespodziewany błąd podczas ładowania zestawów zadań.',
                })
            })
            .finally(() => {
                setFetchingExerciseSets(false)
            })
    }, [])

    const combineDateTime = (date: Date | undefined, time: Date | undefined): Date | undefined => {
        if (!date || !time) return undefined
        const newDate = new Date(date)
        newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds())
        return newDate
    }

    const handleCreateAssignment = async () => {
        const combinedStartDate = combineDateTime(startDate, startTime)
        const combinedDueDate = combineDateTime(dueDate, dueTime)

        if (!assignmentName || !combinedStartDate || !combinedDueDate || !selectedExerciseSetId) {
            toast({
                title: 'Błąd',
                description: 'Wszystkie pola są wymagane!',
            })
            return
        }

        setLoading(true)
        const assignmentCreator: AssignmentCreator = {
            name: assignmentName,
            startDate: combinedStartDate.toISOString(),
            dueDate: combinedDueDate.toISOString(),
            classId: params.id,
            exerciseSetId: selectedExerciseSetId,
        }

        const result = await createAssignment(assignmentCreator)

        if (result.success) {
            toast({
                title: 'Sukces',
                description: 'Zadanie zostało pomyślnie utworzone.',
            })
            setAssignmentName('')
            setStartDate(undefined)
            setStartTime(undefined)
            setDueDate(undefined)
            setDueTime(undefined)
            setSelectedExerciseSetId('')
        } else {
            toast({
                title: 'Błąd',
                description: result.error,
            })
        }

        setLoading(false)
    }

    const handleGoBackToClass = () => {
        router.push(`class/${params.id}`)
    }

    return (
        <div className="w-full max-w-xl">
            <Card className="m-2">
                <CardHeader>
                    <CardTitle>Utwórz Nowe Zadanie</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="assignment-name">Nazwa Zadania</Label>
                            <Input
                                id="assignment-name"
                                value={assignmentName}
                                onChange={(e) => setAssignmentName(e.target.value)}
                                placeholder="Wpisz nazwę zadania"
                            />
                        </div>

                        {/* Start Date and Time */}
                        <div>
                            <Label>Data i Godzina Rozpoczęcia</Label>
                            <div className="flex space-x-4">
                                <DateTimePicker
                                    granularity="day"
                                    value={startDate}
                                    onChange={setStartDate}
                                    placeholder="Wybierz datę"
                                    locale={pl}
                                />
                                <TimePicker date={startTime} onChange={setStartTime} granularity={"minute"} />
                            </div>
                        </div>

                        {/* Due Date and Time */}
                        <div>
                            <Label>Data i Godzina Zakończenia</Label>
                            <div className="flex space-x-4">
                                <DateTimePicker
                                    granularity="day"
                                    value={dueDate}
                                    onChange={setDueDate}
                                    placeholder="Wybierz datę"
                                    locale={pl}
                                />
                                <TimePicker date={dueTime} onChange={setDueTime} granularity={"minute"} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="exercise-set">Zestaw Zadań</Label>
                            {fetchingExerciseSets ? (
                                <p className="text-gray-500">Ładowanie zestawów zadań...</p>
                            ) : (
                                <Select onValueChange={setSelectedExerciseSetId}>
                                    <SelectTrigger id="exercise-set">
                                        <SelectValue placeholder="Wybierz zestaw zadań" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exerciseSetList.map((set) => (
                                            <SelectItem key={set.id} value={set.id}>
                                                {set.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={ handleGoBackToClass }>
                        Wróć
                    </Button>
                    <Button onClick={handleCreateAssignment} disabled={loading || fetchingExerciseSets}>
                        {loading ? 'Tworzenie...' : 'Utwórz'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
