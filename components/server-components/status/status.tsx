import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

const getApiStatus = async () => {
    try {
        const response = await fetch(`${process.env.API_URL}/api/status`, {
            cache: "no-cache",
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
    }
    catch (e) {
        console.log(e)

        return {
            apiStatus: "Failed",
            openAIApiConnectionStatus: "Failed"
        }
    }
}

export default async function Status() {
    const apiStatus = await getApiStatus()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Status witryny mathAi
                    </TableHead>
                </TableRow>
                <TableRow>
                    <TableHead>
                        Połączenie
                    </TableHead>
                    <TableHead>
                        Status
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow>
                    <TableCell>API mathAi</TableCell>
                    <TableCell>{apiStatus.apiStatus}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>OpenAI</TableCell>
                    <TableCell>{apiStatus.openAIApiConnectionStatus}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}