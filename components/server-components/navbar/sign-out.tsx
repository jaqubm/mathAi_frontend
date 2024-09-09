import { signOut } from "@/auth"
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <DropdownMenuItem>
                <button type="submit">
                    Wyloguj się
                </button>
            </DropdownMenuItem>
        </form>
    )
}