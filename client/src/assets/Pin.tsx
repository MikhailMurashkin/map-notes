import * as React from 'react'


function Pin({ selected = false, hidden = false }) {
  if (selected) {
    return(
      <img src="./story.png" width="31" height="30"
        style={{cursor: "pointer", filter: 'drop-shadow( 0px 7px 3px rgba(0, 0, 0, 0.7))'}}
      />
    )
  } else {
      return (
        <img src="./story.png" width="31" height="30" style={{cursor: "pointer", opacity: hidden ? '0.3' : '1'}} />
      )
  }
}

export default Pin;