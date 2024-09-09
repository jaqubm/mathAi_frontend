import { signIn } from "@/auth"
import {Button} from "@/components/ui/button";

export default function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google")
            }}
        >
            <Button variant="outline" type="submit">Zaloguj się z Google</Button>
        </form>
    )
}