export async function FirstTimeSignIn(email: string) {
    if (email === "")
        return false

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/FirstTimeSignIn/${email}`, {
            method: "Get",
            signal: AbortSignal.timeout(180000),
        })

        if (response.ok) {
            const firstTimeSignIn = await response.text()
            return firstTimeSignIn === "true";
        } else {
            const errorMessage = await response.text()
            console.error('Error: ', errorMessage)
        }
    } catch (e) {
        console.error('Error: ', e)
    }
}

export async function IsTeacher(email: string) {
    if (email === "")
        return false

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/IsTeacher/${email}`, {
            method: "Get",
            signal: AbortSignal.timeout(180000),
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

export async function UpdateToTeacher(email: string) {
    if (email === "")
        return

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/UpdateToTeacher/${email}`, {
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

export async function UpdateToStudent(email: string) {
    if (email === "")
        return

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/UpdateToStudent/${email}`, {
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

export async function GetUserExerciseSets(email: string) {
    if (email === "")
        return { success: false, error: 'Email is missing!' }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/GetExerciseSets/${email}`, {
            method: "Get",
            signal: AbortSignal.timeout(180000),
        })

        if (response.ok) {
            const userExerciseSets = await response.json()

            const sortedExerciseSets = userExerciseSets.sort((a: any, b: any) => {
                return a.name.localeCompare(b.name)
            })

            return { success: true, data: sortedExerciseSets }
        } else {
            const error = await response.text()
            return { success: false, error: `HTTP error! Status: ${response.status} - ${error}` }
        }
    } catch (e) {
        console.error('Error while trying to get users exercise sets:', e)
        return { success: false, error: 'Failed to get users exercise sets.' }
    }
}
