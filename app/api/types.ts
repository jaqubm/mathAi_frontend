import {DateTime} from "@auth/core/providers/kakao";

export type AssignmentCreator = {
    name: string
    startDate: DateTime
    dueDate: DateTime
    classId: string
    exerciseSetId: string
}

export type Assignment = {
    name: string
    startDate: DateTime
    dueDate: DateTime
    classId: string
    className: string
    exerciseSetId: string
    exerciseList: Exercise[]
    assignmentSubmissionList: AssignmentSubmissionList[]
}

export type AssignmentList = {
    id: string
    name: string
    startDate: Date
    dueDate: Date
    classId: string
    exerciseSetId: string
}

export type AssignmentSubmission = {
    id: string
    assignmentName: string
    startDate: DateTime
    dueDate: DateTime
    exerciseList: Exercise[]
}

export type AssignmentSubmissionList = {
    id: string
    submissionDate: DateTime | null
    completed: boolean
    studentId: string
    student: User
    score: number
    exerciseAnswerList: ExerciseAnswer[]
}

export type ClassCreator = {
    name: string
    studentEmailList: string[]
}

export type Class = {
    name: string
    owner: User
    isOwner: boolean
    studentList: User[]
    assignmentList: AssignmentList[]
}

export type ExerciseAnswerCreator = {
    assignmentSubmissionId: string
    exerciseId: string
    answerImageFile: File
}

export type ExerciseAnswer = {
    id: string
    exerciseId: string
    grade: number
    feedback: string
    // answerImageFile: File
}

export type ExerciseDetailed = {
    id: string
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export type Exercise = {
    id: string
    content: string
    isAnswered: boolean
}

export type ExerciseSet = {
    name: string
    schoolType: string
    grade: number
    subject: string
    personalized: string
    isOwner: boolean
    exerciseList: ExerciseDetailed[]
}

export type ExerciseSetSettings = {
    schoolType: string
    grade: number
    subject: string
    personalized: string
    numberOfExercises: number
}

export type ExerciseUpdate = {
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export type UserAssignmentSubmissionList = {
    id: string
    completed: boolean
    assignmentId: string
    assignmentName: string
    className: string
    startDate: DateTime
    dueDate: DateTime
}

export type UserClassList = {
    id: string
    name: string
    owner: User
    isOwner: boolean
}

export type User = {
    email: string
    name: string
    isTeacher: boolean
    firstTimeSignIn: boolean
}

export type UserExerciseSetList = {
    id: string
    name: string
    schoolType: string
    grade: string
    subject: string
    personalized: string
}