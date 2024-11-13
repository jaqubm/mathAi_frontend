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
    isOwner: boolean
    exercises: Exercise[]
}

export interface ExerciseSetSettings {
    schoolType: string
    grade: number
    subject: string
    numberOfExercises: number
}

export interface ExerciseSetList {
    id: string
    name: string
    schoolType: string
    grade: string
    subject: string
}

export interface Class {

}

export interface ClassCreator {
    name: string
    studentEmailList: string[]
}

export interface ClassList {
    id: string
    name: string
    owner: User
}