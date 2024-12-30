import {DateTime} from "@auth/core/providers/kakao";

export interface AssignmentCreator {
    name: string
    startDate: DateTime
    dueDate: DateTime
    classId: string
    exerciseSetId: string
}

export interface Assignment {
    name: string
    startDate: DateTime
    dueDate: DateTime
    classId: string
    class: Class
    exerciseSetId: string
    assignmentSubmissionList: AssignmentSubmissionList[]
}

export interface AssignmentList {
    id: string
    name: string
    startDate: Date
    dueDate: Date
    classId: string
    exerciseSetId: string
}

export interface AssignmentSubmission {
    id: string
    assignmentName: string
    startDate: DateTime
    dueDate: DateTime
    exerciseList: Exercise[]
}

export interface AssignmentSubmissionList {
    id: string
    submissionDate: DateTime | null
    completed: boolean
    studentId: string
    student: User
    score: number | null
}

export interface ClassCreator {
    name: string
    studentEmailList: string[]
}

export interface Class {
    name: string
    owner: User
    isOwner: boolean
    studentList: User[]
    assignmentList: AssignmentList[]
}

export interface ExerciseAnswerCreator {
    assignmentSubmissionId: string
    exerciseId: string
    answerImageFile: File
}

export interface ExerciseDetailed {
    id: string
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export interface Exercise {
    id: string
    content: string
}

export interface ExerciseSet {
    name: string
    schoolType: string
    grade: number
    subject: string
    personalized: string
    isOwner: boolean
    exerciseList: ExerciseDetailed[]
}

export interface ExerciseSetSettings {
    schoolType: string
    grade: number
    subject: string
    personalized: string
    numberOfExercises: number
}

export interface ExerciseUpdate {
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export interface UserAssignmentSubmissionList {
    id: string
    completed: boolean
    assignmentId: string
    assignmentName: string
    className: string
    startDate: DateTime
    dueDate: DateTime
}

export interface UserClassList {
    id: string
    name: string
    owner: User
    isOwner: boolean
}

export interface User {
    email: string
    name: string
    isTeacher: boolean
    firstTimeSignIn: boolean
}

export interface UserExerciseSetList {
    id: string
    name: string
    schoolType: string
    grade: string
    subject: string
    personalized: string
}