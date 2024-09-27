import {  MDBFooter } from 'mdb-react-ui-kit'
import React from 'react'


function Footer() {
  return (
    <>
    <MDBFooter className='bg-dark text-center text-white fixed-auto'>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 Copyright:
        <a className='text-white text-decoration-none' href='https://SPS.com/'>
           &nbsp;SPS.com
        </a>
      </div>
    </MDBFooter>
    
    </>
  )
}

export default Footer