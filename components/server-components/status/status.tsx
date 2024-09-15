'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import React, {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {getApiStatus} from "@/app/api/status/status";

export default function Status() {
    const [apiStatus, setApiStatus] = useState({
        apiStatus: null,
        databaseConnectionStatus: null,
        openAiApiConnectionStatus: null
    });

    useEffect(() => {
        const fetchStatus = async () => {
            return await getApiStatus();
        };

        fetchStatus()
            .then(r => setApiStatus(r));
    }, []);

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
                        <TableCell>{apiStatus.apiStatus ?? <Spinner size="small"/>}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>mathAi Database</TableCell>
                        <TableCell>{apiStatus.databaseConnectionStatus ?? <Spinner size="small"/>}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>OpenAI</TableCell>
                        <TableCell>{apiStatus.openAiApiConnectionStatus ?? <Spinner size="small"/>}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
