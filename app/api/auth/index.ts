'use server'

import {signIn, signOut} from "@/auth";

export async function handleServerSignOut() {
    await signOut()
}

export async function handleServerSignIn() {
    await signIn("google")
}