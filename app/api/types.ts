import {DateTime} from "@auth/core/providers/kakao";

export interface User {
    email: string
    name: string
    isTeacher: boolean
    firstTimeSignIn: boolean
}

export interface Exercise {
    id: string
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export interface ExerciseUpdate {
    content: string
    firstHint: string
    secondHint: string
    thirdHint: string
    solution: string
}

export interface ExerciseSet {
    name: string
    schoolType: string
    grade: number
    subject: string
    personalized: string
    isOwner: boolean
    exercises: Exercise[]
}

export interface ExerciseSetSettings {
    schoolType: string
    grade: number
    subject: string
    personalized: string
    numberOfExercises: number
}

export interface ExerciseSetList {
    id: string
    name: string
    schoolType: string
    grade: string
    subject: string
    personalized: string
}

export interface Class {
    name: string
    owner: User
    isOwner: boolean
    students: User[]
    assignments: AssignmentList[]
}

export interface ClassCreator {
    name: string
    studentEmailList: string[]
}

export interface ClassList {
    id: string
    name: string
    owner: User
    isOwner: boolean
}

export interface Assignment {

}

export interface AssignmentCreator {
    name: string
    startDate: DateTime
    dueDate: DateTime
    classId: string
    exerciseSetId: string
}

export interface AssignmentList {
    id: string
    name: string
    startDate: Date
    dueDate: Date
    classId: string
    exerciseSetId: string
}