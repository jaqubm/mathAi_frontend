import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account }) {
            if (account) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/SignIn`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${account.id_token}`,
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
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token
            }
            return token
        },
        async session({ session, token }) {
            session.idToken = token.idToken as string
            return session
        },
    }
})
