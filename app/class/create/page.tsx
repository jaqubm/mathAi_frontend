'use client'

import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form"
import {useRouter} from "next/navigation"
import React, {useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {useSession} from "next-auth/react"
import {createClass} from "@/app/api/class";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {X} from "lucide-react";
import {getIsTeacher, getUserExist} from "@/app/api/user";
import {Spinner} from "@/components/ui/spinner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name have maximum of 255 characters"),
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
            ownerId: "",
            classStudents: [],
        },
    })

    form.setValue("ownerId", user?.user?.email as string ?? "")

    const { setValue, watch } = form;
    const students = watch('classStudents');

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
                setValue('classStudents', [...students, studentId])
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
        setValue('classStudents', updatedStudents)
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        data.ownerId = user?.user?.email || ""

        const result = await createClass(data)

        if (result.success) {
            // router.push(`/class/${result.data}`)
        } else {
            setLoading(false)
            setAlertMessage(result.error || "Failed to create class.")
            setShowAlert(true)
        }
    }

    return (
        <>
            <div className="w-full max-w-7xl mx-auto my-10 flex justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-2 sm:w-[640px]">
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

                        {/* Add Student Field */}
                        <FormItem>
                            <FormLabel>Dodaj Studenta (ID)</FormLabel>
                            <FormControl>
                                <Input
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Wpisz ID studenta"
                                />
                            </FormControl>
                            {studentError && <p className="text-red-500">{studentError}</p>}
                            <Button onClick={handleAddStudent} type="button" className="mt-2" disabled={checkingStudent}>
                                {checkingStudent ? <Spinner size="small" /> : "Dodaj Studenta"}
                            </Button>
                        </FormItem>

                        {/* Display the list of added students */}
                        {students.length > 0 && (
                            <div className="mt-4">
                                <h4>Dodani Studenci:</h4>
                                <ul>
                                    {students.map((student, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <li>{student}</li>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveStudent(index)}
                                            >
                                                <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                            {index !== students.length - 1 && <Separator className="my-2" />}
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" disabled={loading} className="mt-4">
                            {loading ? "Tworzenie..." : "Utwórz Klasę"}
                        </Button>
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
