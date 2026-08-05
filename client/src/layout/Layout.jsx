import React from 'react'
import NavBar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
// import Footer from '../cpmponents/Footer'

function Layout() {
  return (
    <div>
      <NavBar/>
      <Outlet/>
      {/* <Footer/> */}
    </div>
  )
}

export default Layout