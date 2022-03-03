import { Person } from "./person";

export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RolllStateType; student: Person }[]
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RolllStateType, student: Person }[]
}

export type RolllStateType = "unmark" | "present" | "absent" | "late" 
