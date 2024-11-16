'use client'

import Link from 'next/link'
import React, {useState} from 'react'
import {Menu} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet'

export function LinkNavbar({isTeacher}: {isTeacher: boolean}) {
    const [isOpen, setIsOpen] = useState(false)

    const handleLinkClick = () => {
        setIsOpen(false)
    }

    return (
        <>
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                    Strona Główna
                </Link>
                <Link href="/exerciseset/generate" className="text-muted-foreground transition-colors hover:text-foreground">
                    Generuj Zestaw Zadań
                </Link>
                {isTeacher && (
                    <Link href="/class/create" className="text-muted-foreground transition-colors hover:text-foreground">
                        Stwórz Klasę
                    </Link>
                )}
                <Link href="/status" className="text-muted-foreground transition-colors hover:text-foreground">
                    Status
                </Link>
            </nav>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>
                            Strona Główna
                        </Link>
                        <Link href="/exerciseset/generate" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>
                            Generuj Zestaw Zadań
                        </Link>
                        {isTeacher && (
                            <Link href="/class/create" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>
                                Stwórz Klasę
                            </Link>
                        )}
                        <Link href="/status" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>
                            Status
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    )
}
