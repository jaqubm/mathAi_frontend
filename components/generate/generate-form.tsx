'use client'

import {z} from 'zod'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {MultiStepLoader} from "@/components/ui/multi-step-loader"
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import {generateExerciseSet} from "@/app/api/generate";

const loadingStates = [
    { text: "Przygotowywanie danych..." },
    { text: "Komunikowanie się z serwerem..." },
    { text: "Generowanie zadań..." },
    { text: "Już prawie gotowe..." },
]

const formSchema = z.object({
    UserId: z.string().nullable().optional(),
    SchoolType: z.string().min(1),
    Grade: z.number().int(),
    Subject: z.string().min(1),
    NumberOfExercises: z.number().int().nonnegative(),
})

const topics: { [key: string]: { [key: string]: string[] } } = {
    "Szkoła Podstawowa": {
        "4": [
            "Arytmetyka: Liczby naturalne, całkowite, ułamki",
            "Arytmetyka: Działania arytmetyczne: dodawanie, odejmowanie, mnożenie, dzielenie",
            "Arytmetyka: Procenty, proporcje",
            "Geometria: Figury płaskie: kwadraty, prostokąty, trójkąty, koła",
            "Geometria: Obwody i pola figur",
            "Geometria: Podstawy brył: sześciany, prostopadłościany",
            "Podstawy algebry: Wyrażenia algebraiczne",
            "Podstawy algebry: Proste równania i nierówności"
        ],
        "5": [
            "Arytmetyka: Liczby naturalne, całkowite, ułamki",
            "Arytmetyka: Działania arytmetyczne: dodawanie, odejmowanie, mnożenie, dzielenie",
            "Arytmetyka: Procenty, proporcje",
            "Geometria: Figury płaskie: kwadraty, prostokąty, trójkąty, koła",
            "Geometria: Obwody i pola figur",
            "Geometria: Podstawy brył: sześciany, prostopadłościany",
            "Podstawy algebry: Wyrażenia algebraiczne",
            "Podstawy algebry: Proste równania i nierówności"
        ],
        "6": [
            "Arytmetyka: Liczby naturalne, całkowite, ułamki",
            "Arytmetyka: Działania arytmetyczne: dodawanie, odejmowanie, mnożenie, dzielenie",
            "Arytmetyka: Procenty, proporcje",
            "Geometria: Figury płaskie: kwadraty, prostokąty, trójkąty, koła",
            "Geometria: Obwody i pola figur",
            "Geometria: Podstawy brył: sześciany, prostopadłościany",
            "Podstawy algebry: Wyrażenia algebraiczne",
            "Podstawy algebry: Proste równania i nierówności"
        ],
        "7": [
            "Algebra: Równania i nierówności liniowe",
            "Algebra: Układy równań",
            "Algebra: Funkcje: definicje, wykresy, własności funkcji liniowych i kwadratowych",
            "Geometria: Twierdzenie Pitagorasa",
            "Geometria: Kąty i ich miary",
            "Geometria: Konstrukcje geometryczne",
            "Geometria: Figury przestrzenne: objętości i pola powierzchni brył",
            "Statystyka i prawdopodobieństwo: Podstawowe pojęcia statystyczne",
            "Statystyka i prawdopodobieństwo: Prawdopodobieństwo zdarzeń",
            "Trygonometria: Podstawy trygonometrii: kąty, sinus, cosinus, tangens"
        ],
        "8": [
            "Algebra: Równania i nierówności liniowe",
            "Algebra: Układy równań",
            "Algebra: Funkcje: definicje, wykresy, własności funkcji liniowych i kwadratowych",
            "Geometria: Twierdzenie Pitagorasa",
            "Geometria: Kąty i ich miary",
            "Geometria: Konstrukcje geometryczne",
            "Geometria: Figury przestrzenne: objętości i pola powierzchni brył",
            "Statystyka i prawdopodobieństwo: Podstawowe pojęcia statystyczne",
            "Statystyka i prawdopodobieństwo: Prawdopodobieństwo zdarzeń",
            "Trygonometria: Podstawy trygonometrii: kąty, sinus, cosinus, tangens"
        ]
    },
    "Liceum": {
        "1": [
          "Test"
        ],
    },
}

export function GenerateForm() {
    const [selectedSchoolType, setSelectedSchoolType] = useState("")
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState("")
    const [selectedNumberOfExercises, setSelectedNumberOfExercises] = useState<number | null>(null)

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            UserId: "",
            SchoolType: "",
            Grade: 0,
            Subject: "",
            NumberOfExercises: 0,
        },
    })

    useEffect(() => {
        if (selectedSchoolType && selectedGrade !== null && selectedSubject && selectedNumberOfExercises !== null) {
            setIsAllSelected(true);
        } else {
            setIsAllSelected(false);
        }
    }, [selectedSchoolType, selectedGrade, selectedSubject, selectedNumberOfExercises])

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)

        const validatedData = formSchema.parse(data)

        const result = await generateExerciseSet(validatedData)

        console.log(result)

        setLoading(false)
    }

    const handleSchoolTypeChange = (value: string) => {
        setSelectedSchoolType(value)
        setSelectedGrade(null)
        setAvailableSubjects([])
        setSelectedSubject("")
        setSelectedNumberOfExercises(null)
        form.setValue("SchoolType", value)
    }

    const handleGradeChange = (value: string) => {
        const grade = parseInt(value, 10)
        setSelectedGrade(grade)
        setAvailableSubjects(topics[selectedSchoolType][grade] || [])
        setSelectedSubject("")
        form.setValue("Grade", grade)
    }

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
        form.setValue("Subject", value)
    }

    const handleNumberOfExercisesChange = (value: string) => {
        setSelectedNumberOfExercises(parseInt(value, 10))
        form.setValue("NumberOfExercises", parseInt(value, 10))
    }

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} />

            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 flex flex-col items-center">

                    {/* School Type Select */}
                    <FormField
                        control={form.control}
                        name="SchoolType"
                        render={() => (
                            <FormItem>
                                <FormLabel>Rodzaj szkoły</FormLabel>
                                <FormControl>
                                    <Select onValueChange={handleSchoolTypeChange}>
                                        <SelectTrigger className="w-fit min-w-32 p-4">
                                            <SelectValue placeholder="Wybierz rodzaj szkoły" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(topics).map((schoolType) => (
                                                <SelectItem key={schoolType} value={schoolType}>
                                                    {schoolType}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Grade Select */}
                    <FormField
                        control={form.control}
                        name="Grade"
                        render={() => (
                            <FormItem>
                                <FormLabel>Klasa</FormLabel>
                                <FormControl>
                                    <Select onValueChange={handleGradeChange} disabled={!selectedSchoolType}>
                                        <SelectTrigger className="w-fit min-w-32 p-4">
                                            <SelectValue placeholder="Wybierz klasę" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(topics[selectedSchoolType] || {}).map((grade) => (
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

                    {/* Subject Select */}
                    <FormField
                        control={form.control}
                        name="Subject"
                        render={() => (
                            <FormItem>
                                <FormLabel>Przedmiot</FormLabel>
                                <FormControl>
                                    <Select onValueChange={handleSubjectChange} disabled={!selectedGrade}>
                                        <SelectTrigger className="w-fit min-w-32 p-4">
                                            <SelectValue placeholder="Wybierz przedmiot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSubjects.map((subject, index) => (
                                                <SelectItem key={index} value={subject}>
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Number of Exercises Select */}
                    <FormField
                        control={form.control}
                        name="NumberOfExercises"
                        render={() => (
                            <FormItem>
                                <FormLabel>Liczba zadań</FormLabel>
                                <FormControl>
                                    <Select onValueChange={handleNumberOfExercisesChange}>
                                        <SelectTrigger className="w-fit min-w-32 p-4">
                                            <SelectValue placeholder="Wybierz liczbę zadań" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(20)].map((_, i) => (
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

                    <Button type="submit" disabled={!isAllSelected}> {/* Disable the button initially */}
                        Generuj
                    </Button>
                </form>
            </Form>
        </div>
    )
}