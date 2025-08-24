import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import LandingPage from './Pages/LandingPage';
import AuthPage from './Pages/AuthPage';
import { usePuterStore } from './lib/puter';
import UploadPage from './Pages/UploadPage';
import ResumePage from './Pages/ResumePage';
import WipeApp from './Pages/WipeApp'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />} />
      <Route path='auth' element={<AuthPage />} />
      <Route path='upload' element={<UploadPage />} />
      <Route path='resume/:resumeid' element={<ResumePage />} />
      <Route path='wipe' element={<WipeApp />} />
    </>
  )
)

const Root = ()=>{
  const {init} = usePuterStore();

  useEffect(() => {
    init();
  },[init]);

  return <RouterProvider router={router} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
