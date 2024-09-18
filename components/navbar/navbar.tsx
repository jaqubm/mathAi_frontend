'use server'

import {CircleUser} from "lucide-react"
import React from "react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ModeToggle} from "@/components/navbar/mode-toggle"
import SignIn from "@/components/navbar/sign-in"
import {auth} from "@/auth"
import {SignOut} from "@/components/navbar/sign-out"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DialogAccountType,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/navbar/dialog-account-type"
import {redirect} from "next/navigation"
import {FirstTimeSignIn, IsTeacher, UpdateToStudent, UpdateToTeacher,} from "@/app/api/user"
import {ClientNavbar} from "@/components/navbar/client-navbar";

export async function Navbar() {
    const user = await auth()

    const firstTimeSignIn = await FirstTimeSignIn(user?.user?.email ?? "")

    const isTeacher = await IsTeacher(user?.user?.email ?? "")

    const onClickUpdateToTeacher = async () => {
        await UpdateToTeacher(user?.user?.email ?? "")

        redirect("/")
    }

    const onClickUpdateToStudent = async () => {
        await UpdateToStudent(user?.user?.email ?? "")

        redirect("/")
    }

    return (
        <header className="sticky top-0 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">

            <ClientNavbar/>

            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                {user ? (
                    <DialogAccountType open={firstTimeSignIn}>
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
                                <SignOut />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Twoje pierwsze logowanie?</DialogTitle>
                                <DialogDescription>
                                    Wybierz typ konta jakie ma zostać zastosowane. Pamiętaj, tej
                                    decyzji nie można zmienić!
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center justify-center gap-3">
                                <form action={onClickUpdateToTeacher}>
                                    <Button type="submit">Jestem nauczycielem</Button>
                                </form>

                                <form action={onClickUpdateToStudent}>
                                    <Button type="submit">Jestem uczniem</Button>
                                </form>
                            </div>
                        </DialogContent>
                    </DialogAccountType>
                ) : (
                    <SignIn />
                )}

                <ModeToggle />
            </div>
        </header>
    )
}
