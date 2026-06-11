import React from 'react'
import Nav from '../features/shared/components/Nav'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <div>
        <Nav />
        <Outlet/>
    </div>
  )
}

export default AppLayout