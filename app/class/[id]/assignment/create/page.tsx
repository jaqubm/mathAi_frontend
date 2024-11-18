'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {Label} from '@/components/ui/label'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {TimePicker} from '@/components/ui/datetime-picker'
import {getUserExerciseSetList} from "@/app/api/user"
import {createAssignment} from '@/app/api/assignment'
import {getClass} from '@/app/api/class'
import {toast} from '@/hooks/use-toast'
import {CalendarIcon} from 'lucide-react'
import {AssignmentCreator, Class, ExerciseSetList} from '@/app/api/types'
import {cn} from "@/lib/utils";
import {Spinner} from "@/components/ui/spinner";

function getDefaultTime(): Date {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
}

export default function CreateAssignmentPage({ params }: { params: { id: string } }) {
    const router = useRouter()

    const [assignmentName, setAssignmentName] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>()
    const [startTime, setStartTime] = useState<Date | undefined>(getDefaultTime())
    const [dueDate, setDueDate] = useState<Date | undefined>()
    const [dueTime, setDueTime] = useState<Date | undefined>(getDefaultTime())
    const [selectedExerciseSetId, setSelectedExerciseSetId] = useState('')

    const [currClass, setCurrClass] = useState<Class | undefined>()
    const [exerciseSetList, setExerciseSetList] = useState<ExerciseSetList[]>()
    const [loading, setLoading] = useState(false)
    const [fetchingData, setFetchingData] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classResult = await getClass(params.id)
                if (classResult.success) {
                    setCurrClass(classResult.data)
                } else {
                    toast({
                        title: 'Błąd',
                        description: 'Nie udało się załadować danych o klasie',
                    })
                    router.push(`/class/${params.id}`)
                }

                const exerciseSetResult = await getUserExerciseSetList()
                if (exerciseSetResult.success) {
                    setExerciseSetList(exerciseSetResult?.data)
                } else {
                    toast({
                        title: 'Błąd',
                        description: exerciseSetResult.error,
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                toast({
                    title: 'Błąd',
                    description: 'Wystąpił niespodziewany błąd',
                })
                router.push(`/class/${params.id}`)
            } finally {
                setFetchingData(false)
            }
        }

        fetchData()
    }, [params.id, router])

    const combineDateTime = (date: Date | undefined, time: Date | undefined): Date | undefined => {
        if (!date || !time) return undefined
        const newDate = new Date(date)
        newDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds())
        return newDate
    }

    const handleCreateAssignment = async () => {
        const combinedStartDate = combineDateTime(startDate, startTime)
        const combinedDueDate = combineDateTime(dueDate, dueTime)

        console.log('assignmentName', assignmentName)
        console.log('combinedStartDate', combinedStartDate)
        console.log('combinedDueDate', combinedDueDate)
        console.log('selectedExerciseSetId', selectedExerciseSetId)

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
            router.push(`/class/${params.id}`)
        } else {
            toast({
                title: 'Błąd',
                description: result.error,
            })
        }

        setLoading(false)
    }

    if (currClass !== undefined && !currClass.isOwner) {
        toast({
            title: 'Błąd',
            description: 'Jedynie nauczyciel może utworzyć zadanie',
        })

        router.push(`/class/${params.id}`)
    }

    if (fetchingData) {
        return <Spinner size="medium" />
    }

    return (
        <div className="w-full max-w-xl">
            <Card className="m-2">
                <CardHeader className="gap-1">
                    <CardTitle>
                        Utwórz Nowe Zadanie
                    </CardTitle>
                    <h1>Klasa: {currClass?.name}</h1>
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
                            <div className="flex gap-2 sm:flex-row flex-col justify-between">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn(
                                            "sm:w-[280px] justify-start text-left font-normal",
                                            !startDate && "text-muted-foreground"
                                        )}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? startDate.toLocaleDateString() : "Wybierz datę"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <TimePicker
                                    date={startTime}
                                    onChange={setStartTime}
                                    granularity="minute"
                                />
                            </div>
                        </div>

                        {/* Due Date and Time */}
                        <div>
                            <Label>Data i Godzina Zakończenia</Label>
                            <div className="flex gap-2 sm:flex-row flex-col justify-between">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn(
                                            "sm:w-[280px] justify-start text-left font-normal",
                                            !dueDate && "text-muted-foreground"
                                        )}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? dueDate.toLocaleDateString() : "Wybierz datę"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={setDueDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <TimePicker
                                    date={dueTime}
                                    onChange={setDueTime}
                                    granularity="minute"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="exercise-set">Zestaw Zadań</Label>
                            {fetchingData ? (
                                <p className="text-gray-500">Ładowanie zestawów zadań...</p>
                            ) : (
                                <Select onValueChange={setSelectedExerciseSetId}>
                                    <SelectTrigger id="exercise-set">
                                        <SelectValue placeholder="Wybierz zestaw zadań" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {exerciseSetList && exerciseSetList.map((set) => (
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
                    <Button variant="outline" onClick={() => router.push(`/class/${params.id}`)}>
                        Wróć
                    </Button>
                    <Button onClick={handleCreateAssignment} disabled={loading || fetchingData}>
                        {loading ? 'Tworzenie...' : 'Utwórz'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
