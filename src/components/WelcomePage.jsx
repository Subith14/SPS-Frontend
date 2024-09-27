import React from 'react'
// import background from '../img/background.jpg'
import './wp.css'
import { Link } from 'react-router-dom'

function WelcomePage() {
  return (
    <>
    <section>
        <div className='bgimg'>
            <img src='https://c4.wallpaperflare.com/wallpaper/674/457/195/hands-minimalistic-paper-rock-wallpaper-preview.jpg' alt="backround img" width={'100%'} height={'604'} />
        </div>
        <div className='ibtn'>
            <Link to={'/game'} className='btn btn-light'>Play Now</Link>
        </div>
    </section>
    </>
  )
}

export default WelcomePage