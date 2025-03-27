import React from 'react'

function SecondaryButton({children, onClick}) {
  return (
     <button onClick={onClick} className='secondary_button'>
        {children}
     </button>
  )
}

export default SecondaryButton