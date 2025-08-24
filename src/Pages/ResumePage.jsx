import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ResumePageNavbar from '../components/ResumePageNavbar';
import { usePuterStore } from '../lib/puter';
import resumescan from '/resume-scan-2.gif'
import ResumeReview from '../components/ResumeReview';


const ResumeView =({feedback, imageUrl, resumeUrl}) =>{
    return (
        <div className='flex sm:flex-row gap-5 w-full flex-col-reverse'>
            
            {imageUrl && resumeUrl &&(
                <div className='animate-in fade-in duration-1000 m-5 mb-0 sm:w-1/2 p-5 bg-base-100 rounded-xl'>
                    <a href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                        <img src={imageUrl} alt="resume image"
                            className='w-full h-auto rounded-xl'
                            title='Resume' />
                    </a>
                </div>
            )}

                
            <div className='animate-in fade-in duration-1000 sm:w-1/2 max-sm:ml-5 bg-base-100 mt-5 mr-5 p-5 rounded-xl'>
                <ResumeReview feedback={feedback}/>
            </div>
                

        </div>
    )
}

const ResumePage = () => {
    const {auth, isLoading, fs, kv} = usePuterStore();
    const {resumeid} = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
            if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${resumeid}`); 
          },[auth.isAuthenticated])


    useEffect(() =>{
        const loadResume = async () =>{
            const resume = await kv.get(`resume:${resumeid}`);

            if (!resume) return;
            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob],{type:'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
        }

        loadResume();

    },[resumeid]);

  return (
    <div>
        <ResumePageNavbar />
        <p className='text-white font-mono italic sm:text-2xl text-xl text-center mt-5 font-semibold'>Resume Review</p>


        {feedback ? (
            <ResumeView feedback={feedback} resumeUrl={resumeUrl} imageUrl={imageUrl}/>
        ):(
            <div className='flex flex-col items-center justify-center ml-10 sm:ml-25'><img src ={resumescan} className='size-100 sm:size-200'/></div>  
        )}

        
    </div>
  )
}

export default ResumePage