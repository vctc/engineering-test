import React, { useState, useEffect } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { useStudentState } from "staff-app/Context/StudentProvider"

interface Props {
  rollType?: RolllStateType
  size?: number
  id: number
  clickable?:Boolean
}
export const RollStateSwitcher: React.FC<Props> = ({ rollType, id, size = 40 , clickable}) => {
  const [rollState, setRollState] = useState<RolllStateType>("unmark")
  const { dispatch } = useStudentState()

  useEffect(() => {
    if (rollType) {
      setRollState(rollType)
    }
  }, [rollType])
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    if (clickable === false) {
      return
    }
    const next = nextState()
    setRollState(next)
    dispatch({
      type: "SET_ROLE",
      data: { id, roll: next },
    })
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} clickable={clickable} />
}
