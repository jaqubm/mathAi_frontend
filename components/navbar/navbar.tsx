'use client'

import {CircleUser} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ModeToggle} from "@/components/navbar/mode-toggle";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DialogAccountContent,
    DialogAccountDescription,
    DialogAccountHeader,
    DialogAccountTitle,
    DialogAccountType,
} from "@/components/navbar/dialog-account-type";
import {ClientNavbar} from "@/components/navbar/client-navbar";
import {DialogTrigger} from "@/components/ui/dialog";
import {UserExerciseSetsDialog} from "@/components/navbar/user-exercise-sets-dialog";
import {signIn, signOut, useSession} from "next-auth/react";
import {FirstTimeSignIn, IsTeacher, UpdateToStudent, UpdateToTeacher} from "@/app/api/user";
import {useRouter} from "next/navigation";
import {handleServerSignIn, handleServerSignOut} from "@/app/api/auth";

export function Navbar() {
    const router = useRouter()

    let { data: user } = useSession()

    const [firstTimeSignIn, setFirstTimeSignIn] = useState(false)
    const [isTeacher, setIsTeacher] = useState(false)

    const email = user?.user?.email ?? "";

    const handleSignIn = async () => {
        await handleServerSignIn()
    }

    const handleSignOut = async () => {
        await handleServerSignOut()
            .then(() => {
                signOut()
            })
    }

    useEffect(() => {
        if (!email) return

        FirstTimeSignIn(email).then(setFirstTimeSignIn)

        IsTeacher(email).then(setIsTeacher)
    }, [email])

    const handleUpdateToTeacher = async () => {
        if (email) {
            await UpdateToTeacher(email)

            FirstTimeSignIn(email).then(setFirstTimeSignIn)
            IsTeacher(email).then(setIsTeacher)

            router.push('/')
        }
    }

    const handleUpdateToStudent = async () => {
        if (email) {
            await UpdateToStudent(email)

            FirstTimeSignIn(email).then(setFirstTimeSignIn)
            IsTeacher(email).then(setIsTeacher)

            router.push('/')
        }
    }

    console.log(firstTimeSignIn)

    return (
        <header className="sticky top-0 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <ClientNavbar />

            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                {user ? (
                    <>
                        {/* First-time sign-in dialog */}
                        {firstTimeSignIn && (
                            <DialogAccountType open={firstTimeSignIn}>
                                <DialogAccountContent className="sm:max-w-md">
                                    <DialogAccountHeader>
                                        <DialogAccountTitle>Twoje pierwsze logowanie?</DialogAccountTitle>
                                        <DialogAccountDescription>
                                            Wybierz typ konta, jakie ma zostać zastosowane. Pamiętaj, tej decyzji nie można zmienić!
                                        </DialogAccountDescription>
                                    </DialogAccountHeader>

                                    <div className="flex items-center justify-center gap-3">
                                        <Button onClick={handleUpdateToTeacher}>Jestem nauczycielem</Button>
                                        <Button onClick={handleUpdateToStudent}>Jestem uczniem</Button>
                                    </div>
                                </DialogAccountContent>
                            </DialogAccountType>
                        )}

                        {/* Users exercise sets dialog with DropDownMenu */}
                        <UserExerciseSetsDialog email={email}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <Avatar>
                                            <AvatarImage
                                                src={user.user?.image?.toString()}
                                                alt={user.user?.name?.toString()}
                                                className="w-full h-full"
                                            />
                                            <AvatarFallback>
                                                <CircleUser className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="sr-only">Menu użytkownika</span>
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-fit flex flex-col items-center" align="center">
                                    <DropdownMenuLabel>{user.user?.name}</DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>Moje Zestawy Zadań</DropdownMenuItem>
                                    </DialogTrigger>

                                    <DropdownMenuSeparator />

                                    <form action={handleSignOut}>
                                        <DropdownMenuItem>
                                            <button type="submit">
                                                Wyloguj się
                                            </button>
                                        </DropdownMenuItem>
                                    </form>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </UserExerciseSetsDialog>
                    </>
                ) : (
                    <form action={handleSignIn}>
                        <Button variant="outline" type="submit">Zaloguj się z Google</Button>
                    </form>
                )}

                <ModeToggle/>
            </div>
        </header>
    )
}
