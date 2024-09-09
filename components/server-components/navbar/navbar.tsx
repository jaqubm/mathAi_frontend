'use server'

import Link from "next/link"
import {CircleUser, Menu} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {redirect} from "next/navigation";

async function IsTeacher(email: string) {
    if (email === "")
        return false

    try {
        const response = await fetch(`${process.env.API_URL}/User/IsTeacher/${email}`, {
            method: "Get",
        })

        if (response.ok) {
            const isTeacher = await response.text()
            return isTeacher === "true";
        } else {
            const errorMessage = await response.text()
            console.error('Error: ', errorMessage)
        }
    } catch (e) {
        console.error('Error: ', e)
    }
}

async function UpdateToTeacher(email: string) {
    if (email === "")
        return

    try {
        const response = await fetch(`${process.env.API_URL}/User/UpdateToTeacher/${email}`, {
            method: "Put",
        })

        if (response.ok) {
            return
        } else {
            const errorMessage = await response.text()
            console.error('Error: ', errorMessage)
        }
    } catch (e) {
        console.error('Error: ', e)
    }
}

export async function Navbar() {
    const user = await auth()

    const isTeacher = await IsTeacher(user?.user?.email ?? "")

    const onClickUpdate = async () => {
        'use server'

        await UpdateToTeacher(user?.user?.email ?? "")

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
                    <Dialog>
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
                                {!isTeacher ? (
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            Jesteś nauczycielem?
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                ) : null}
                                <SignOut/>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="sm:max-w-md">

                            <DialogHeader>
                                <DialogTitle>Jesteś nauczycielem?</DialogTitle>
                                <DialogDescription>
                                    Zaktualizuj swoje konto to konta nauczyciela.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="flex items-center">
                                <DialogClose asChild>
                                    <form action={onClickUpdate}>
                                        <Button type="submit">
                                            Potwierdź
                                        </Button>
                                    </form>
                                </DialogClose>
                            </DialogFooter>

                        </DialogContent>

                    </Dialog>
                ) : (
                    <SignIn/>
                )}


                <ModeToggle/>

            </div>
        </header>
    )
}