import React from 'react'
import { Link} from 'react-router-dom';
import { usePuterStore } from '../lib/puter';
import { useState, useEffect } from 'react';


const ResumeCard = ({resume}) => {
    const {fs} = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState('');

    useEffect(()=>{
        const loadResume = async () =>{
          const blob = await fs.read(resume.imagePath);
          if (!blob) return;
          let url = URL.createObjectURL(blob);
          setResumeUrl(url);
        }

        loadResume();
      },[resume.imagePath]);

  return (
    <Link to={`/resume/${resume.id}`} className='flex flex-col bg-base-100 animate-in fade-in duration-500 rounded-xl p-4  mt-5 min-w-[300px]'>
        <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-col gap-1 sm:gap-2'>
                {resume.companyName && <p className='font-mono text-xl font-semibold text-white '>{resume.companyName}</p>}
                {resume.jobTitle && <p className='font-mono text-gray-200 '>{resume.jobTitle}</p>}

                {!resume.companyName && !resume.jobTitle && <h2 className='font-mono text-xl font-semibold text-white '>Resume</h2>}
            </div>
            <div 
                className={`radial-progress ${resume.feedback.overallScore >=90 ? 'text-info':resume.feedback.overallScore >=80 ? 'text-success':resume.feedback.overallScore >=60 ? 'text-accent':resume.feedback.overallScore >=50 ?'text-warning':'text-error'}`} 
                style={{ '--value': resume.feedback.overallScore}} 
                role="progressbar">
                    {`${resume.feedback.overallScore  || 0}/100`}
            </div> 
        </div>
        {resumeUrl && (<div className='animate-in fade-in duration-1000 mx-2 my-2 '>
            <img 
            src={resumeUrl} 
            alt="resume" 
            className='rounded-xl aspect-[16/9] w-full h-[200px] sm:h-[350px] object-cover  object-top '/>
        </div>)}
    </Link>
  )
}

export default ResumeCard