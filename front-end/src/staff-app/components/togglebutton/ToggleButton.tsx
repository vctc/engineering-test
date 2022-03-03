import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai"
import { Button,  MenuItem } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import { makeStyles } from "@material-ui/core/styles"
import "./ToggleButton.css"
import { useStudentState } from "staff-app/Context/StudentProvider"


const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  textWhite: {
    color: "#fff !important",
  },
}))
const ToggleButton = () => {
  const classes = useStyles()
  const [toggle, setToggle] = useState(false)
  const [selectedColumn, setSelectedColumn] = React.useState("1")
  const { dispatch} = useStudentState()
  useEffect(() => {
    dispatch({
      type: "FILTER_DATA",
      data: {toggle,selectedColumn}
    })
  }, [toggle, selectedColumn])
  const handleToggle = () => {
    setToggle(!toggle)
  }
  const handleSelect = (event: SelectChangeEvent) => {
    setSelectedColumn(event.target.value as string)
  }

  return (
    <div className={classes.container}>
      <FormControl fullWidth>
        <Select value={selectedColumn} label="sort by" onChange={handleSelect}>
          <MenuItem value={1}>First Name</MenuItem>
          <MenuItem value={2}>Last Name</MenuItem>
        </Select>
      </FormControl>
      <Button aria-label="increase" onClick={handleToggle}>
        {!toggle ? <AiOutlineSortAscending size={"25px"} color="#fff" /> : <AiOutlineSortDescending size={"25px"} color="#fff" />}
      </Button>
    </div>
  )
}

export default ToggleButton
