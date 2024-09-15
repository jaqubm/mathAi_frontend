'use server'

import Link from "next/link"
import {CircleUser, Menu} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {ModeToggle} from "@/components/server-components/navbar/mode-toggle";
import SignIn from "@/components/server-components/navbar/sign-in";
import {auth} from "@/auth";
import {SignOut} from "@/components/server-components/navbar/sign-out";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DialogAccountType,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/server-components/navbar/dialog-account-type";
import {redirect} from "next/navigation";
import React from "react";
import {FirstTimeSignIn, IsTeacher, UpdateToStudent, UpdateToTeacher} from "@/app/api/user";

export async function Navbar() {
    const user = await auth()

    const firstTimeSignIn = await FirstTimeSignIn(user?.user?.email ?? "")

    const isTeacher = await IsTeacher(user?.user?.email ?? "")

    const onClickUpdateToTeacher = async () => {
        'use server'

        await UpdateToTeacher(user?.user?.email ?? "")

        redirect("/")
    }

    const onClickUpdateToStudent = async () => {
        'use server'

        await UpdateToStudent(user?.user?.email ?? "")

        redirect("/")
    }

    return(
        <header className="sticky top-0 flex h-16 w-full items-center justify-between gap-4 border-b bg-background px-4 md:px-6">

            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Strona Główna
                </Link>
                <Link
                    href="/status"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Status
                </Link>
            </nav>

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">

                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Strona Główna
                        </Link>
                        <Link
                            href="/status"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Status
                        </Link>
                    </nav>

                </SheetContent>
            </Sheet>
            <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">

                {user ? (
                    <DialogAccountType open={firstTimeSignIn}>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>

                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Avatar>
                                        <AvatarImage src={user.user?.image?.toString()} alt={user.user?.name?.toString()} className="w-full h-full"/>
                                        <AvatarFallback>
                                            <CircleUser className="h-5 w-5"/>
                                        </AvatarFallback>
                                    </Avatar>

                                    <span className="sr-only">Menu użytkownika</span>
                                </Button>

                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-fit flex flex-col items-center" align="center">

                                <DropdownMenuLabel>{user.user?.name}</DropdownMenuLabel>

                                <DropdownMenuSeparator/>

                                <SignOut/>

                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="sm:max-w-md">

                            <DialogHeader>
                                <DialogTitle>Twoje pierwsze logowanie?</DialogTitle>
                                <DialogDescription>
                                    Wybierz typ konta jakie ma zostać zastosowane.
                                    Pamiętaj, tej decyzji nie można zmienić!
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center justify-center gap-3">
                                <form action={onClickUpdateToTeacher}>
                                    <Button type="submit">
                                        Jestem nauczycielem
                                    </Button>
                                </form>

                                <form action={onClickUpdateToStudent}>
                                    <Button type="submit">
                                        Jestem uczniem
                                    </Button>
                                </form>
                            </div>

                        </DialogContent>

                    </DialogAccountType>
                ) : (
                    <SignIn/>
                )}


                <ModeToggle/>

            </div>
        </header>
    )
}