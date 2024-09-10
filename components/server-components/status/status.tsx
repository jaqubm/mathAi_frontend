import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React from "react";

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
            databaseConnectionStatus: "Failed",
            openAiApiConnectionStatus: "Failed",
        }
    }
}

export default async function Status() {
    const apiStatus = await getApiStatus()

    return (
        <div>
            <h2 className="md:text-6xl font-bold text-center">
                mathAi
            </h2>

            <Table>
                <TableHeader>
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
                        <TableCell>mathAi API</TableCell>
                        <TableCell>{apiStatus.apiStatus}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>mathAi Database</TableCell>
                        <TableCell>{apiStatus.databaseConnectionStatus}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>OpenAI</TableCell>
                        <TableCell>{apiStatus.openAiApiConnectionStatus}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}