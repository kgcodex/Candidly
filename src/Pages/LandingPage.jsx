import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import ResumeCard from '../components/ResumeCard'
import { usePuterStore } from '../lib/puter';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import resumescan from '/resume-scan-2.gif'

const LandingPage = () => {

    const {auth, kv} = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] =  useState([]);
    const [loadingResumes, setLoadingResumes] = useState(false);
    
    
    useEffect(()=>{
        if (!auth.isAuthenticated) navigate('/auth?next=/'); 
      },[auth.isAuthenticated]);

    useEffect(()=>{
      const loadResumes = async () =>{
        setLoadingResumes(true);

        const resumes = (await kv.list("resume:*",true))

        const parsedResumes = resumes?.map((resume) =>(
          JSON.parse(resume.value)
        ))
        
        setResumes(parsedResumes || []);
        setLoadingResumes(false);
      }
      loadResumes()
    },[]);

      

  return (
    <div className='bg-base-200'>
        <Navbar />
        <div className='flex flex-col items-center mx-10 mt-15'>
            <h1 className='text-primary text-5xl text-center lg:text-8xl font-mono font-bold'>
                Track Your Applications & Resume Ratings
            </h1>

            {!loadingResumes && resumes?.length === 0 ?(
              <p className='text-white font-mono italic text-2xl text-center mt-5 font-semibold'>
                  No resume found. Upload your first resume to get feedback.
              </p>
            ):(
              <p className='text-white font-mono italic text-2xl text-center mt-5 font-semibold'>
                Review your submissions and get AI-powered feedback.
              </p>
            )}

            {loadingResumes && (
                <div className='flex flex-col items-center justify-center ml-10 sm:ml-25'><img src ={resumescan} className='size-100 sm:size-200'/></div>  
              
            )}
            
        

        <div className='grid sm:grid-cols-2 sm:gap-8 mt-10 md:grid-cols-3 md:gap-4 '>
            {!loadingResumes && resumes.length > 0 && 
              resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))
            }
        </div>
        </div>
    </div>
  )
}

export default LandingPage