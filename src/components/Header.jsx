import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'



function Header() {
  return (
    <>
    <Navbar className="bg-dark">
        <Container>
          <Navbar.Brand href="#home" className='d-flex'>
            <Link to={'/'}>
            <img
              alt="logo"
              src="https://static.vecteezy.com/system/resources/thumbnails/000/691/497/small_2x/rock-paper-scissors-neon-icons.jpg"
              width="80"
              height="50"
              className="d-inline-block align-center"
            />{' '}
            </Link>
            
            <h1 className='d-flex align-items-center text-light mx-5'>Stone Paper Scissors</h1>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  )
}

export default Header