import React, { useEffect, useState } from 'react'
import ScoreGuage from './ScoreGuage'
import CautionIcon from './CautionIcon';
import CircleCheckIcon from './CircleCheckIcon'


const ScoreBoard =({feedback, parameter}) => {
    const [badgeText, setBadgeText] = useState('');
    const [parameterText, setParameterText] = useState('');
    const [scoreColor,setScoreColor] = useState('');
    const [score, setScore] = useState(0);

    const scoresValueSetter =()=>{
        const score = feedback[parameter].score;
        setScore(score);

        const badgeText = score>=90?'Strong':score>=80?'Good':score>=60?'Need Improv..':score>=50?'Good Start':'Need Work';
        setBadgeText(badgeText);

        const parameterText = parameter==='toneAndStyle'?'Tone':parameter==='content'?'Content':parameter==='structure'?'Structure':'Skills';
        setParameterText(parameterText);

        const scoreColor = score>=90?'text-info':score>=80?'text-success':score>=60?'text-accent':score>=50?'text-warning':'text-error';
        setScoreColor(scoreColor);
    }

    useEffect(() =>{
        scoresValueSetter();
    },[feedback,parameter]);

    return (
        <div className='flex flex-row justify-between p-5 items-center bg-base-200  rounded-xl mb-5'>
                <div className='flex flex-row gap-2 items-center'>
                    <p className='text-white font-mono font-semibold text-2xl max-sm:text-xl'>{parameterText}</p>
                    <div className={` badge badge-outline ${score>=90?'badge-info':score>=80?'badge-success':score>=60?'badge-accent':score>=50?'badge-warning':'badge-error'}`}>{badgeText}</div>
                </div>
                <p className='text-2xl font-mono font-bold text-white max-sm:text-xl'><span className={scoreColor}>{score}</span>/100</p>
            </div>
    )
}

const ParameterDetail = ({feedback, parameter,}) => {
    const [parameterText, setParameterText] = useState('');
    const [score, setScore] = useState(0);
    const [badgeText, setBadgeText] = useState('');


    const parameterDetailsSetter =()=>{
        const score = parameter==='ATS'?feedback.overallScore:feedback[parameter].score;
        setScore(score);

        const badgeText = score>=90?'Strong':score>=80?'Good':score>=60?'Need Improvement':score>=50?'Good Start':'Need Work';
        setBadgeText(badgeText);

        const parameterText = parameter==='toneAndStyle'?'Tone & Style':parameter==='content'?'Content':parameter==='structure'?'Structure':parameter==='skills'?'Skills':'ATS';
        setParameterText(parameterText);

    }

    useEffect(() =>{
        parameterDetailsSetter();
    },[feedback,parameter]);

    return (
            
        <div className="collapse collapse-arrow bg-base-100 border border-base-300 mb-2">
            <input type="radio" name="feedback accordian" defaultChecked />
            <div className="collapse-title text-white font-mono font-semibold text-2xl max-sm:text-xl">{parameterText}</div>
            <div className='collapse-content'>
                <div className={` mb-2 max-sm:text-lg text-xl font-bold italic font-mono ${score>=90?'text-info':score>=80?'text-success':score>=60?'text-accent':score>=50?'text-warning':'text-error'}`}>{badgeText}</div>
                <div className="text-lg">
                <ul className="space-y-4">
                        {feedback[parameter]?.tips.map((tip, index) => (
                            <li key={index} className="flex items-center gap-5">
                                {tip.type === 'good' ? (
                                    <div className='flex-shrink-0 text-success'><CircleCheckIcon /></div>
                                ) : (
                                    <div className='flex-shrink-0 text-warning'><CautionIcon /></div>
                                )}
                                <div>
                                    <span className="font-semibold text-white text-lg">{tip.tip}</span>
                                    <p className="text-sm  mt-1 italic text-gray-200">{tip.explanation}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>

    )
}

const OverAllScore =({feedback}) =>{
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-around gap-5 items-center mb-5'>
                <div className='flex flex-col'>
                    <h2 className='text-primary sm:text-3xl text-2xl font-mono font-bold'>Your Resume Score </h2>
                    <p className='text-white font-mono font-medium'>This score is calculated based on these parameters.</p>
                </div>
                <ScoreGuage score={feedback.overallScore} />
            </div>

            <ScoreBoard feedback={feedback} parameter={"toneAndStyle"} />
            <ScoreBoard feedback={feedback} parameter={"content"} />
            <ScoreBoard feedback={feedback} parameter={"structure"} />
            <ScoreBoard feedback={feedback} parameter={"skills"} />

            <div className='text-primary sm:text-3xl text-2xl font-mono font-bold mb-5 mt-10'>Detailed Explaination</div>

            <ParameterDetail feedback={feedback} parameter={'ATS'} />
            <ParameterDetail feedback={feedback} parameter={"toneAndStyle"} />
            <ParameterDetail feedback={feedback} parameter={"content"} />
            <ParameterDetail feedback={feedback} parameter={"structure"} />
            <ParameterDetail feedback={feedback} parameter={"skills"} />






        </div>
    )

}

const ResumeReview = ({feedback}) => {
  return (
    <OverAllScore feedback={feedback} />
  )
}

export default ResumeReview