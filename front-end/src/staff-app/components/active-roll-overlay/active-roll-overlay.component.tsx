import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { ItemType, RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useStudentState } from "staff-app/Context/StudentProvider"
import { RollInput, RolllStateType } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { useNavigate } from "react-router-dom"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction | ItemType, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { isActive, onItemClick } = props
  const [present, setPresent] = useState(0)
  const [absent, setAbsent] = useState(0)
  const [late, setLate] = useState(0)
  const [total, setTotal] = useState(0)
  const [saveRoll, response, loadState] = useApi<{ success: Boolean }>({ url: "save-roll" })
  const { state } = useStudentState()
  useEffect(() => {
    setTotal(state.globalStudent.length)
    const presentStudents = state.globalStudent.filter((student) => student.rollType == "present")
    const absentStudents = state.globalStudent.filter((student) => student.rollType == "absent")
    const lateStudents = state.globalStudent.filter((student) => student.rollType == "late")
    setPresent(presentStudents.length)
    setAbsent(absentStudents.length)
    setLate(lateStudents.length)
  }, [state])

  const handleComplete = () => {
    const completeArr = state.globalStudent.map((student) => {
      if (student.rollType) {
        return {
          student_id: student.id,
          roll_state: student.rollType,
          student: student
        }
      } else {
        return {
          student_id: student.id,
          roll_state: "unmark" as RolllStateType,
          student: student
        }
      }
    })

    const params: RollInput = {
      student_roll_states: completeArr,
    }

    saveRoll(params)
    navigate("/staff/activity")
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: total },
              { type: "present", count: present },
              { type: "late", count: late },
              { type: "absent", count: absent },
            ]}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={handleComplete}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
