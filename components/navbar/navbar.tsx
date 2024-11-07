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
import {LinkNavbar} from "@/components/navbar/link-navbar";
import {UserExerciseSetsDialog} from "@/components/navbar/user-exercise-sets-dialog";
import {signOut, useSession} from "next-auth/react";
import {getUser, updateUserAccountType, User} from "@/app/api/user";
import {handleServerSignIn, handleServerSignOut} from "@/app/api/auth";
import {wakeUpDatabase} from "@/app/api/status";
import {Spinner} from "@/components/ui/spinner";
import {UserClassesDialog} from "@/components/navbar/user-classes-dialog";

export function Navbar() {
    let { data: session } = useSession()
    const [userDb, setUserDb] = useState<User>()
    const [refresh, setRefresh] = useState(false)

    const [databaseWokeUp, setDatabaseWokeUp] = useState<boolean>(false)

    const [openDialog, setOpenDialog] = useState<string | null>(null)

    useEffect(() => {
        const wakeUpDatabaseUseEffect = async () => {
            return await wakeUpDatabase()
        }

        wakeUpDatabaseUseEffect().then(res => setDatabaseWokeUp(res))

        const intervalId = setInterval(wakeUpDatabaseUseEffect, 60000)

        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        const getUserUseEffect = async () => {
            if (session?.idToken) return await getUser()
        }

        getUserUseEffect().then(res => {
            if (res !== null) setUserDb(res)
        })
    }, [session?.idToken, refresh]);

    const handleSignIn = async () => {
        await handleServerSignIn()
    }

    const handleSignOut = async () => {
        await handleServerSignOut()
            .then(() => {
                signOut()
            })
    }

    const handleUpdateToTeacher = async () => {
        if (session && session.idToken) {
            await updateUserAccountType(true)
            setRefresh(!refresh)
        }
    }

    const handleUpdateToStudent = async () => {
        if (session && session.idToken) {
            await updateUserAccountType(false)
            setRefresh(!refresh)
        }
    }

    const handleDialogOpen = (dialogType: string) => {
        setOpenDialog(dialogType)
    }

    const handleDialogClose = () => {
        setOpenDialog(null)
    }

    return (
        <header className="sticky top-0 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            <LinkNavbar isTeacher={ !!(userDb && userDb.isTeacher) }/>

            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                {session && userDb ? (
                    <>
                        {/* First-time sign-in dialog */}
                        {userDb.firstTimeSignIn && (
                            <DialogAccountType open={userDb.firstTimeSignIn}>
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
                        <UserExerciseSetsDialog open={openDialog === 'exerciseSets'} onClose={handleDialogClose} >
                            <UserClassesDialog open={openDialog === 'classes'} onClose={handleDialogClose} >
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="icon" className="rounded-full">
                                            <Avatar>
                                                <AvatarImage
                                                    src={session.user?.image?.toString()}
                                                    alt={userDb.name}
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
                                        <DropdownMenuLabel>{userDb.name}</DropdownMenuLabel>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem onClick={() => handleDialogOpen('exerciseSets')}>
                                            Moje Zestawy Zadań
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => handleDialogOpen('classes')}>
                                            Moje Klasy
                                        </DropdownMenuItem>

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
                            </UserClassesDialog>
                        </UserExerciseSetsDialog>
                    </>
                ) : (
                    <form action={handleSignIn}>
                        <Button variant="outline" type="submit" disabled={!databaseWokeUp}>
                            {!databaseWokeUp ?
                                <>
                                    <Spinner size="small" className="mr-4"/>
                                    Ładowanie..
                                </>
                                : "Zaloguj się z Google"}
                        </Button>
                    </form>
                )}

                <ModeToggle/>
            </div>
        </header>
    )
}
