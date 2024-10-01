import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account }) {
            if (account) {
                try {
                    console.log(account.providerAccountId)
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/SignIn`, {
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
            }

            return false
        },
    }
})