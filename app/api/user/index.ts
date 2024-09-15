export async function FirstTimeSignIn(email: string) {
    if (email === "")
        return false

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/FirstTimeSignIn/${email}`, {
            method: "Get",
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