import React, { createContext, ReactNode, useContext, useReducer } from "react"
import { nonMutatingSort } from "shared/helpers/sort-data"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"

type IStudentState = {
  globalStudent: Person[]
  students: Person[]
}

type IStudentAction =
  | {
      type: "SET_DATA"
      data: Person[]
    }
  | {
      type: "FILTER_DATA"
      data: { toggle: boolean; selectedColumn: string }
    }
  | {
      type: "SET_ROLE"
      data: { roll: RolllStateType; id: number }
    }
  | {
      type: "FILTER_BY_ROLL"
      data: { roll: RolllStateType | "all" }
  } | {
    type: "SEARCH",
    data: {text: string}
  }

const initialStudentContext: {
  state: IStudentState
  dispatch: React.Dispatch<IStudentAction>
} = {
  state: { students: [] as Person[], globalStudent: [] as Person[] },
  dispatch: () => null,
}

const reducer = ({ students, globalStudent }: IStudentState, action: IStudentAction) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        students: action.data,
        globalStudent: action.data,
      }

    case "FILTER_DATA":
      const sorted = nonMutatingSort(students, action.data.toggle, action.data.selectedColumn)
      return {
        globalStudent: globalStudent,
        students: sorted,
      }

    case "SET_ROLE":
      const modifiedStudents = students.map((student) => {
        if (student.id === action.data.id) {
          return { ...student, rollType: action.data.roll }
        } else {
          return { ...student }
        }
      })
      return {
        students: modifiedStudents,
        globalStudent: modifiedStudents,
      }

    case "FILTER_BY_ROLL":
      if (action.data.roll === "all") {
        return {
          students: globalStudent,
          globalStudent: globalStudent,
        }
      }
      const filteredStudents = globalStudent.filter((student) => student.rollType === action.data.roll)
      return {
        students: filteredStudents,
        globalStudent: globalStudent,
      }

    case "SEARCH":
      const searchedStudent = globalStudent.filter((student) => {
        return `${student.first_name} ${student.last_name}`.toLowerCase().includes(action.data.text.toLowerCase())
      })
      return {
        students: searchedStudent,
        globalStudent: globalStudent
      }

    default:
      return {
        students: [],
        globalStudent: [],
      }
  }
}

const StudentContext = createContext(initialStudentContext)

const initialState = {
  students: [],
  globalStudent: [],
}
interface StudentProviderProps {
  children: ReactNode
}
const StudentProvider = ({ children }: StudentProviderProps): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <StudentContext.Provider value={{ state, dispatch }}>{children}</StudentContext.Provider>
}

export default StudentProvider

export const useStudentState = () => useContext(StudentContext)
