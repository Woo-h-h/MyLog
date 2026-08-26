import { api, getData } from './client'
import type { StudentWorkData } from '../types/studentWork'

export function fetchStudentWork() {
  return getData<StudentWorkData>(api.get('/content/student-work'))
}
