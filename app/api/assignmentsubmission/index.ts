import {AssignmentSubmission, ExerciseAnswer, ExerciseAnswerCreator} from "@/app/api/types";
import axios, {AxiosError} from "axios";
import axiosInstance from "@/app/api";

export const getAssignmentSubmission = async (assignmentSubmissionId: string) => {
    try {
        const response = await axiosInstance.get(`/AssignmentSubmission/Get/${assignmentSubmissionId}`)

        return { success: true, data: response.data as AssignmentSubmission }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to get assignment submission.";

        return { success: false, error: errorMessage };
    }
}

export const addExerciseAnswerToAssignmentSubmission = async (exerciseAnswerCreator: ExerciseAnswerCreator) => {
    const formData = new FormData()

    formData.append("assignmentSubmissionId", exerciseAnswerCreator.assignmentSubmissionId)
    formData.append("exerciseId", exerciseAnswerCreator.exerciseId)
    formData.append("answerImageFile", exerciseAnswerCreator.answerImageFile)

    try {
        const response = await axiosInstance.put(
            `/AssignmentSubmission/AddExerciseAnswer`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to add answer.";

        return { success: false, error: errorMessage };
    }
}

export const markAssignmentSubmissionAsCompleted = async (assignmentSubmissionId: string) => {
    try {
        const response = await axiosInstance.put(`/AssignmentSubmission/MarkAsCompleted/${assignmentSubmissionId}`)

        return { success: true, data: response.data as string }

    } catch (error: AxiosError | any) {
        if (axios.isCancel(error)) {
            return { success: false, error: "Request was canceled." }
        }

        const errorMessage = error.response
            ? `HTTP error! Status: ${error.response.status} - ${error.response.statusText}`
            : "Failed to mark assignment as completed.";

        return { success: false, error: errorMessage };
    }
}
