import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {axiosInstance} from "@/app/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account }) {
            if (account) {
                try {
                    const response = await axiosInstance.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/User/SignIn`,
                        JSON.stringify(account.id_token),
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    )

                    if (response.status === 200) {
                        return true
                    } else {
                        console.error('Error: ', response.data || 'Unknown error')
                    }
                } catch (e) {
                    console.error('Error: ', e)
                }
            }

            return false
        },
    }
})
