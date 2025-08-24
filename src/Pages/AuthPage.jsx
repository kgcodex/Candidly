import React from 'react'
import { usePuterStore } from '../lib/puter';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthPage = () => {
  const {isLoading, auth, } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(()=>{
    if (auth.isAuthenticated) navigate(next); 
  },[auth.isAuthenticated,next])

  return (
    <div className='bg-base-200 flex flex-col items-center justify-center gap-5 h-screen'>

      <div className=' bg-base-100 rounded-3xl p-10 m-5'>
        <h1 className='text-primary text-4xl sm:text-5xl text-center font-mono mb-5 font-bold text-shadow-primary text-shadow-xl'>Welcome</h1>
        <h2 className='text-white text-xl text-center font-semibold mb-5'>Log In to Continue Your Job Journey</h2>
        <div className='flex flex-col items-center'>
          {isLoading? (
            <button className='btn btn-accent animate-pulse p-5'>
              <p className='font-mono text-xl font-semibold text-white'>Signing you in ...</p>
            </button>
            ):(
              <>
              {auth.isAuthenticated ? (
                <button className='btn btn-accent' onClick={auth.signOut}>
                  <p className='font-mono text-xl font-semibold text-white'>Sign Out</p>
                </button>
              ):(
                <button className='btn btn-accent' onClick={auth.signIn}>
                  <p className='font-mono text-xl font-semibold text-white'>Log in</p>
                </button>
              )}
              </>
            )}
        </div>
      </div>


    </div>
  )
}

export default AuthPage