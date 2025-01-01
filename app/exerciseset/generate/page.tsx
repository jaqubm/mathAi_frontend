'use client'

import {MultiStepLoader} from "@/components/ui/multi-step-loader"
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {generateExerciseSet} from "@/app/api/exerciseset"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {generateExerciseSetLoadingStates, generateExerciseSetPersonalizedList, generateExerciseSetTopics} from "@/data"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input";

const formSchema = z.object({
    schoolType: z.string().min(1),
    grade: z.number().int(),
    subject: z.string().min(1),
    personalized: z.string(),
    numberOfExercises: z.number().int().nonnegative(),
})

export default function GeneratePage() {
    const router = useRouter()

    const [selectedSchoolType, setSelectedSchoolType] = useState("Szkoła Podstawowa")
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedNumberOfExercises, setSelectedNumberOfExercises] = useState<number | null>(null)
    const [selectedPersonalized, setSelectedPersonalized] = useState("")

    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            schoolType: "",
            grade: 0,
            subject: "",
            personalized: "",
            numberOfExercises: 0,
        },
    })

    form.setValue("schoolType", selectedSchoolType)

    useEffect(() => {
        if (selectedSchoolType && selectedGrade !== null && selectedSubject && selectedNumberOfExercises !== null) {
            setIsAllSelected(true)
        } else {
            setIsAllSelected(false)
        }
    }, [selectedSchoolType, selectedGrade, selectedSubject, selectedNumberOfExercises])

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)

        const validatedData = formSchema.parse(data)

        const result = await generateExerciseSet(validatedData)

        if (result.success) {
            router.push(`/exerciseset/${result.data}`)
        } else {
            setLoading(false)
            setAlertMessage(result.error || "Failed to generate the exercise set.")
            setShowAlert(true)
        }
    }

    const handleGradeChange = (value: string) => {
        const grade = parseInt(value, 10)
        setSelectedGrade(grade)
        setAvailableSubjects(generateExerciseSetTopics[selectedSchoolType][grade] || [])
        setSelectedSubject("")
        form.setValue("grade", grade)
    }

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        form.setValue("subject", value)
    }

    const handleNumberOfExercisesChange = (value: string) => {
        setSelectedNumberOfExercises(parseInt(value, 10))
        form.setValue("numberOfExercises", parseInt(value, 10))
    }

    return (
        <>
            <div className="w-full max-w-7xl mx-auto my-10">
                <MultiStepLoader loadingStates={generateExerciseSetLoadingStates} loading={loading} duration={3000} loop={false} />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Tabs for School Type Selection */}
                        <Tabs className="w-full flex flex-col items-center"
                            defaultValue={selectedSchoolType} onValueChange={(value) => {
                            setSelectedSchoolType(value)
                            form.setValue("schoolType", value)
                            setSelectedGrade(null)
                            setAvailableSubjects([])
                            setSelectedSubject("")
                            setSelectedNumberOfExercises(null)
                            setSelectedPersonalized("")
                        }}>
                            <TabsList>
                                {Object.keys(generateExerciseSetTopics).map((schoolType) => (
                                    <TabsTrigger key={schoolType} value={schoolType}>
                                        {schoolType}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Card for Grade, Subject, Number of Exercises Selection */}
                            <TabsContent value={selectedSchoolType}>
                                <Card className="mx-2 sm:w-[640px]">
                                    <CardContent className="p-4 space-y-4 flex flex-col">

                                        <FormField
                                            control={form.control}
                                            name="grade"
                                            render={() => (
                                                <FormItem className="w-full max-w-64 self-center">
                                                    <FormLabel>Klasa</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={handleGradeChange}
                                                                disabled={!selectedSchoolType}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Wybierz klasę"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Object.keys(generateExerciseSetTopics[selectedSchoolType] || {}).map((grade) => (
                                                                    <SelectItem key={grade} value={grade}>
                                                                        {grade}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Conditionally render Subject only if grade is selected */}
                                        {selectedGrade !== null && (
                                            <FormField
                                                control={form.control}
                                                name="subject"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Dział</FormLabel>
                                                        <RadioGroup value={selectedSubject}
                                                                    onValueChange={handleSubjectChange}
                                                                    className="space-y-2">
                                                            {availableSubjects.map((subject, index) => (
                                                                <div key={index}
                                                                     className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={subject}
                                                                                    id={`subject-${index}`}/>
                                                                    <Label
                                                                        htmlFor={`subject-${index}`}>{subject}</Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        <div className="w-full flex sm:flex-row flex-col gap-4">

                                            <FormField
                                                control={form.control}
                                                name="numberOfExercises"
                                                render={() => (
                                                    <FormItem className="w-full flex-1">
                                                        <FormLabel>Liczba zadań</FormLabel>
                                                        <FormControl>
                                                            <Select onValueChange={handleNumberOfExercisesChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Wybierz liczbę zadań"/>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {[...Array(15)].map((_, i) => (
                                                                        <SelectItem key={i} value={(i + 1).toString()}>
                                                                            {i + 1}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="personalized"
                                                render={() => (
                                                    <FormItem className="w-full flex-1">
                                                        <FormLabel>Personalizacja</FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                defaultValue="Brak"
                                                                onValueChange={(value) => {
                                                                    setSelectedPersonalized(value);
                                                                    if (value === "Inne") {
                                                                        form.setValue("personalized", ""); // Set as empty initially for custom input
                                                                    } else {
                                                                        form.setValue("personalized", value === "Brak" ? "" : value);
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Wybierz opcję" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {generateExerciseSetPersonalizedList.map((personalized) => (
                                                                        <SelectItem key={personalized} value={personalized}>
                                                                            {personalized}
                                                                        </SelectItem>
                                                                    ))}
                                                                    <SelectItem key="Inne" value="Inne">
                                                                        Inne
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                        </div>

                                        {selectedPersonalized === "Inne" && (
                                            <div className="mt-4">
                                                <Label htmlFor="custom-personalized">Wpisz własną
                                                    personalizację:</Label>
                                                <Input
                                                    id="custom-personalized"
                                                    placeholder="Wpisz personalizację (max 255 znaków)"
                                                    maxLength={255}
                                                    onChange={(e) => form.setValue("personalized", e.target.value)}
                                                />
                                                <p className="text-right text-sm text-gray-500 mt-2">
                                                    {form.watch("personalized")?.length || 0} / 255
                                                </p>
                                            </div>
                                            )}

                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button variant="outline" type="submit" disabled={!isAllSelected}>Generuj</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </div>

            {/* AlertDialog for error */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Błąd Generowania!</AlertDialogTitle>
                        <AlertDialogDescription>Wystąpił błąd podczas generowania twojego zestawu zadań!</AlertDialogDescription>
                        <AlertDialogDescription>Error message: {alertMessage}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
