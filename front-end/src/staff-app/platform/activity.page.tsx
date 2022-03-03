import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import { AiOutlineDown } from "react-icons/ai"
import { Activity } from "shared/models/activity"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import './activity.page.css'
export const ActivityPage: React.FC = () => {
  const [getActivity, response, loadState] = useApi<{ success: Boolean; activity: Activity[] }>({ url: "get-activities" })
  const [activity, setActivity] = useState<{ success: Boolean; activity: Activity[] }>()

  useEffect(() => {
    getActivity()
  }, [])
  useEffect(() => {
    setActivity(response)
  }, [response])

  const renderHeading = (name: string, date: Date) => {
    return (
      <div style={{ display: "flex", width: "100%", justifyContent: "space-evenly" }}>
        <span>{name}</span>
        <span>{new Date(date).toLocaleDateString("en-us", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</span>
      </div>
    )
  }

  return (
    <S.Container>
      {activity?.activity.map((student) => {
        return (
          <Accordion key={student.entity.id}>
            <AccordionSummary expandIcon={<AiOutlineDown style={{margin: '20px'}} />} aria-controls="panel1a-content" id="panel1a-header">
              {renderHeading(student.entity.name, student.date)}
            </AccordionSummary>
            <AccordionDetails>
              {student.entity.student_roll_states.map((s) => (
                <StudentListTile key={s.student_id} isRollMode={true} clickable={false} student={s.student} />
              ))}
            </AccordionDetails>
          </Accordion>
        )
      })}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
