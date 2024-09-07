import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account }) {
            if (account) {
                try {
                    const response = await fetch(`${process.env.API_URL}/user/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(account.id_token),
                    })

                    if (response.ok) {
                        return true
                    } else {
                        const errorMessage = await response.text()
                        console.error('Error: ', errorMessage)
                    }
                } catch (e) {
                    console.error('Error: ', e)
                }

                return true
            }

            return false
        }
    }
})