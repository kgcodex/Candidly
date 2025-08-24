import React, { useState } from 'react'
import resumeScan from '/resume-scan.gif'
import ResumeForm from '../components/ResumeForm'
import {usePuterStore} from '../lib/puter'
import { useNavigate } from 'react-router-dom'
import { convertPdfToImage } from '../lib/pdftoimage';


const UploadPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        resumeFile: null
      });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value  
        }));
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyse = async ({companyName, jobTitle, jobDescription, resumeFile}) =>{
        setIsProcessing(true);
        setStatusText("Uploading the file....");

        const uploadedFile = await fs.upload([resumeFile]);

        if(!uploadedFile) return setStatusText("File upload failed. Please try again.");

        setStatusText("File uploaded successfully. Analyzing your resume...");
        const imageFile = await convertPdfToImage(resumeFile);
        if(!imageFile.file) {
            setStatusText("Failed to convert PDF to image. Please try again.");
            console.error("PDF Conversion Error:", imageFile.error);
            // setIsProcessing(false);
        }

        const base64Image = await fileToBase64(imageFile.file);

        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText("Image upload failed. Please try again.");

        setStatusText("Resume analysis in progress...");

        const uuid = crypto.randomUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: ''
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        try {
            const response = await fetch("https://candidly-api.vercel.app/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jobTitle,
                jobDescription,
                imageBase64: base64Image
                })
            });

            if (!response.ok) return setStatusText("Feedback generation failed. Try again..");

            const feedback = await response.json();
            if(!feedback) return setStatusText("Failed to get feedback. Please try again.");

            data.feedback = feedback;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete! Redirecting to results...");
            console.log(data);
            

            setTimeout(() => {
                navigate(`/resume/${uuid}`);
            }, 2500);

    } catch (error) {
        console.error("API Error:", error);
        setStatusText("Failed to get feedback. Please try again.");
    }}

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(!formData) return;
        if(!formData.resumeFile) return;

        handleAnalyse(formData); 
    };

  return ( 
        <div className='flex flex-col items-center sm:mx-10 mx-5 pt-15'>
            <h1 className='text-primary text-3xl text-center sm:text-5xl lg:text-8xl font-mono font-bold'>
                Smart feedback for your dream job
            </h1>
            
            {isProcessing ? (
               <div>
                    <h2 className='text-white font-mono italic sm:text-2xl text-center mt-5 font-semibold'>{statusText}</h2>
                    <div className='flex flex-col items-center justify-center sm:ml-25'><img src ={resumeScan} className='size-100'/></div>  

    
               </div>
            ):(
               <>
                    <p className='text-white font-mono italic sm:text-2xl text-center mt-5 font-semibold'>
                    Drop your resume for an ATS score and improvement tips
                    </p>
                    <ResumeForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
               </>
            )}

        
        </div>
  )
}

export default UploadPage