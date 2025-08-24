import React from 'react'
import { Link } from 'react-router-dom'

const ResumePageNavbar = () => {
  return (
    <nav className='w-full p-4 flex justify-between items-center'>
            <p className='text-white text-xl font-mono font-bold italic '><span className='text-4xl'>C</span>andidly</p>
            <Link to={`/`} className='btn btn-primary font-mono font-bold btn-soft'>Back to Homepage</Link>
    </nav>
  )
}

export default ResumePageNavbar