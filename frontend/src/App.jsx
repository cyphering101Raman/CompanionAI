import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-[#0B1630]">
        <Navbar />
        <Outlet />
      </div>
    </>
  )
}

export default App