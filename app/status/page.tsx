import Status from "@/components/server-components/status/status";

export default function ApiStatusPage() {
    return (
        <div className="w-fit mx-auto rounded-md  h-screen overflow-hidden flex flex-col justify-center items-center">
            <Status />
        </div>
    );
}