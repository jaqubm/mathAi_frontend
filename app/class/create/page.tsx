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
import {createClass} from "@/app/api/class"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Plus, X} from "lucide-react"
import {getUserExistsAndIsStudent} from "@/app/api/user"
import {Spinner} from "@/components/ui/spinner"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {useToast} from "@/hooks/use-toast"
import {ToastAction} from "@/components/ui/toast"
import {ClassCreator} from "@/app/api/types";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name can have a maximum of 255 characters"),
    studentEmailList: z.array(z.string().min(1, "Student Email must be a non-empty string"))
})

export default function CreateClassPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [loading, setLoading] = useState(false)
    const [checkingStudent, setCheckingStudent] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [studentEmail, setStudentEmail] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Moja Klasa",
            studentEmailList: [],
        },
    })

    const { setValue, watch } = form
    const students = watch("studentEmailList")

    const handleAddStudent = async () => {
        setCheckingStudent(true)

        if (studentEmail.trim()) {
            if (students.includes(studentEmail)) {
                toast({
                    title: "Błąd",
                    description: `Student ${studentEmail} jest już na liście.`
                });
                setCheckingStudent(false)
                return
            }

            const userExistsAndIsStudent = await getUserExistsAndIsStudent(studentEmail)

            if (userExistsAndIsStudent) {
                setValue("studentEmailList", [...students, studentEmail])
                setStudentEmail("")
                toast({
                    title: "Sukces",
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

    const handleRemoveStudent = (index: number) => {
        const updatedStudents = students.filter((_, i) => i !== index)
        setValue("studentEmailList", updatedStudents)
    }

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)

        const result = await createClass(data as ClassCreator)

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
                                                <Input placeholder="Wpisz nazwę klasy" maxLength={30} {...field} />
                                            </FormControl>
                                            <p className="text-right text-sm text-gray-500 mt-2">
                                                {field.value.length}/30
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                {/* Add Student Field with + Button inside Input */}
                                <FormItem className="mt-4">
                                    <FormLabel>Dodaj Studenta (Email)</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                value={studentEmail}
                                                onChange={(e) => setStudentEmail(e.target.value)}
                                                placeholder="Wpisz Email studenta"
                                                maxLength={255}
                                                className="pr-10"
                                            />
                                        </FormControl>
                                        {checkingStudent ? (
                                            <Spinner size="small" className="absolute inset-y-0 right-3 my-auto"/>
                                        ) : (
                                            <Plus
                                                className="absolute inset-y-0 right-3 my-auto text-green-600 w-5 h-5 hover:w-6 hover:h-6 hover:cursor-pointer"
                                                onClick={handleAddStudent}
                                            />
                                        )}
                                    </div>
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
                                <Button variant="outline" type="submit" disabled={loading} className="mt-4">
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
