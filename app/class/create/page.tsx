'use client'

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useSession } from "next-auth/react"
import { createClass } from "@/app/api/class"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, Plus } from "lucide-react" // Plus icon import
import { getIsTeacher, getUserExist } from "@/app/api/user"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name can have a maximum of 255 characters"),
    ownerId: z.string().min(1, "Owner ID is required"),
    classStudents: z.array(z.string().min(1, "Student ID must be a non-empty string"))
})

export default function CreatePage() {
    const router = useRouter()
    const { data: user } = useSession()

    const [loading, setLoading] = useState(false)
    const [checkingStudent, setCheckingStudent] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [studentId, setStudentId] = useState("")
    const [studentError, setStudentError] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Moja Klasa",
            ownerId: user?.user?.email || "",
            classStudents: [],
        },
    })

    form.setValue("ownerId", user?.user?.email || "")

    const { setValue, watch } = form
    const students = watch("classStudents")

    const handleAddStudent = async () => {
        setStudentError("")
        setCheckingStudent(true)

        if (studentId.trim()) {
            if (students.includes(studentId)) {
                setStudentError(`Student: ${studentId} jest już na liście.`)
                setCheckingStudent(false)
                return
            }

            const studentExists = await getUserExist(studentId)
            const isTeacher = await getIsTeacher(studentId)

            if (studentExists && !isTeacher) {
                setValue("classStudents", [...students, studentId])
                setStudentId("")
            } else if (isTeacher) {
                setStudentError(`Konto: ${studentId} jest kontem nauczyciela.`)
            } else {
                setStudentError(`Student: ${studentId} nie został odnaleziony.`)
            }
        }
        setCheckingStudent(false)
    }

    const handleRemoveStudent = (index: number) => {
        const updatedStudents = students.filter((_, i) => i !== index)
        setValue("classStudents", updatedStudents)
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)

        const result = await createClass(data)

        if (result.success) {
            router.push(`/class/${result.data}`)
        } else {
            setLoading(false)
            setAlertMessage(result.error || "Failed to create class.")
            setShowAlert(true)
        }
    }

    const maxStudentsVisible = 3
    const studentHeight = 60
    const scrollAreaHeight = Math.min(students.length, maxStudentsVisible) * studentHeight

    return (
        <>
            <div className="w-full max-w-7xl mx-auto my-10 flex justify-center items-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Utwórz Nową Klasę</CardTitle>
                            </CardHeader>

                            <CardContent>
                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nazwa Klasy</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Wpisz nazwę klasy" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Add Student Field with + Button inside Input */}
                                <FormItem className="mt-4">
                                    <FormLabel>Dodaj Studenta (Email)</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                value={studentId}
                                                onChange={(e) => setStudentId(e.target.value)}
                                                placeholder="Wpisz Email studenta"
                                                className="pr-10" // Padding for icon
                                            />
                                        </FormControl>
                                        <Button
                                            onClick={handleAddStudent}
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute inset-y-0 right-1 my-auto text-green-600"
                                            disabled={checkingStudent}
                                        >
                                            {checkingStudent ? (
                                                <Spinner size="small" />
                                            ) : (
                                                <Plus className="w-5 h-5" />
                                            )}
                                        </Button>
                                    </div>
                                    {studentError && <p className="text-red-500 mt-1">{studentError}</p>}
                                </FormItem>

                                {/* Display the list of added students */}
                                {students.length > 0 && (
                                    <div className="mt-4">
                                        <FormLabel>Lista Dodanych Studentów:</FormLabel>
                                        <ScrollArea className="mt-2 border rounded-lg p-2" style={{ height: `${scrollAreaHeight}px` }}>
                                            <ul className="px-2">
                                                {students.map((student, index) => (
                                                    <div key={index} className="flex flex-col">
                                                        <div className="flex items-center justify-between">
                                                            <li>{student}</li>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveStudent(index)}
                                                            >
                                                                <X className="h-4 w-4 text-red-500"/>
                                                            </Button>
                                                        </div>
                                                        {index !== students.length - 1 && <Separator className="my-2" />}
                                                    </div>
                                                ))}
                                            </ul>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={loading} className="mt-4">
                                    {loading ? "Tworzenie..." : "Utwórz Klasę"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>

            {/* AlertDialog for error */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Błąd Tworzenia!</AlertDialogTitle>
                        <AlertDialogDescription>Wystąpił błąd podczas tworzenia klasy!</AlertDialogDescription>
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
