import React from 'react'

const ResumeForm = ({ handleSubmit, handleChange, formData }) => {
  return (
    <form 
    className="fieldset bg-base-100 border-base-300 rounded-box  sm:w-1/2 border p-8 mt-5 sm:mt-15 w-3/4 mb-10" 
    onSubmit={handleSubmit}>

        <label className="label text-lg font-semibold text-accent">Company Name</label>
        <input 
        type="text" 
        className="input w-full font-semibold mb-5" 
        placeholder="Company Name"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange} />

        <label className="label font-semibold text-accent text-lg">Job Title</label>
        <input 
        type="text" 
        className="input w-full font-semibold mb-5 " 
        placeholder="Job Title" 
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}/>

        <label className="label font-semibold text-accent text-lg">Job Description</label>
        <textarea 
        rows='4' 
        className="textarea w-full font-semibold mb-5" 
        placeholder="Job Description"
        name="jobDescription"
        value={formData.jobDescription}
        onChange={handleChange}></textarea>

        <label className="label font-semibold text-accent text-lg">Upload Resume</label>
        <input 
        type="file" 
        className="file-input w-full file-input-neutral mb-5"  
        name="resumeFile"
        onChange={handleChange}/>

        <button className='btn btn-accent' type='submit'>Analyse Resume</button>
    </form>
  )
}

export default ResumeForm