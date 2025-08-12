import React from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/owner/Sidebar'


const Layout = () => {
  return (
      <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout