import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { makeStyles } from "@material-ui/core/styles"

import ToggleButton from "staff-app/components/togglebutton/ToggleButton"
import { nonMutatingSort } from "shared/helpers/sort-data"
import TextField from "@mui/material/TextField"
import "./home-board.css"
import { RolllStateType } from "shared/models/roll"
import { useStudentState } from "staff-app/Context/StudentProvider"
import { ItemType } from "staff-app/components/roll-state/roll-state-list.component"

const useStyles = makeStyles(() => ({
  textField: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: "white",
  },
}))

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [filteredStudents, setFilteredStudents] = useState<Person[] | []>([])
  const {state, dispatch } = useStudentState()
  const [list, setList] = useState<{
    present: number[]
    absent: number[]
    late: number[]
  }>({
    present: [],
    absent: [],
    late: [],
  })

  useEffect(() => {
    if (data?.students) {
      const sorted = nonMutatingSort(data.students, false, "1")
      dispatch({
        type: "SET_DATA",
        data: sorted
      })
    }
  }, [data])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction | ItemType) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const handleSearch = (e: any) => {
    dispatch({
      type: "SEARCH",
      data:{text: e.target.value}
    })
  }


  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction}  handleSearch={handleSearch} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {state.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  handleSearch: (e: any) => void
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const classes = useStyles()

  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>
        <ToggleButton />
      </div>
      <div>
        <TextField
          className={classes.textField}
          inputProps={{ className: classes.input }}
          id="filled-search"
          label="Search"
          type="search"
          variant="filled"
          onChange={props.handleSearch}
        />
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
