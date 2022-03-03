import { Person } from "shared/models/person"

export const nonMutatingSort = (arr: Person[], toggle: boolean, selectedItem: string) => {
  let copy = [...arr]

  if (toggle === false && selectedItem == "1") {
    copy.sort((a, b) => {
      return a.first_name.localeCompare(b.first_name)
    })
  }
  if (toggle === false && selectedItem == "2") {
    copy.sort((a, b) => {
      return a.last_name.localeCompare(b.last_name)
    })
  }
  if (toggle === true && selectedItem == "1") {
    copy.sort((a, b) => {
      return b.first_name.localeCompare(a.first_name)
    })
  }
  if (toggle === true && selectedItem == "2") {
    copy.sort((a, b) => {
      return b.last_name.localeCompare(a.last_name)
    })
  }
  return copy
}
