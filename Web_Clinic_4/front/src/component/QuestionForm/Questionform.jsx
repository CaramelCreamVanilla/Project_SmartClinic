import React, { useState , useCallback , useEffect } from 'react';
import Anatomy from '../Anatomy/Anatomy';
import AudioRecordForm from '../Model/Model';
import axios from 'axios';
import QACSS from './Question.module.css'
import { useNavigate } from "react-router-dom";
import AudioPlayer from './audioPlayer';

function QuestionnaireForm() {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [isAnatomySelected, setIsAnatomySelected] = useState(false);
    const [question_ans,setQuestion_ans] = useState([])
    const [answers, setAnswers] = useState({1: null,}); 
    const [speechResult,setSpeechResult] = useState('')
    const [audioPath, setAudioPath] = useState('');

    const navigate = useNavigate();
    const alertStyle = 'px-4 py-3 rounded relative my-3 text-center font-medium text-sm';

    useEffect(()=>{
        const getQuestion = async () =>{
            try{
                const response = await axios.get(import.meta.env.VITE_API_FLASK +'/getQ_A');
                // console.log(response)
                setQuestion_ans(response.data.result)

                fetchvoice(response.data.result[currentQuestion-1].file_name)

            }catch(error){
                console.error('Get question failed:', error.response.data);
            }
        }

        getQuestion()
    },[currentQuestion])

    const fetchvoice = async (filename) =>{
        try{
          const res = await axios.post(import.meta.env.VITE_API_FLASK +'/get_qvoice',{filename})
          setAudioPath(res.data.audioPath)
        //   console.log(res.data.audioPath)
        }catch(error){
          console.error('Error fetching audio file:', error);
        }
    }

    const handleNextQuestion = async () => {
        if(answers[currentQuestion] == null || answers[currentQuestion].ans == ''){
            document.getElementById('isAns').className = `${alertStyle} font-sarabun font-semibold bg-red-100 text-red-700 `;
            document.getElementById('isAns').innerHTML = 'คุณยังไม่ได้ตอบคำถาม';
        }else{
            setCurrentQuestion(currentQuestion + 1);
            document.getElementById('isAns').className = '';
            document.getElementById('isAns').innerHTML = ''
        }
        setIsAnatomySelected(false)
        setSpeechResult('')
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
        document.getElementById('isAns').className = '';
        document.getElementById('isAns').innerHTML = ''
    };

    const handleSubmit = async () => {
        // ตรวจสอบคำตอบสำหรับคำถามปัจจุบัน
        if (answers[currentQuestion] == null || answers[currentQuestion].ans == '') {
            document.getElementById('isAns').className = `${alertStyle} font-sarabun font-semibold bg-red-100 text-red-700 `;
            document.getElementById('isAns').innerHTML = 'คุณยังไม่ได้ตอบคำถาม';
            return;
        }
    
        // ส่งข้อมูล
        try {
            const pressureData = JSON.parse(localStorage.getItem('pressure_json'));
            const account_id = localStorage.getItem('account_id');
            const weight = localStorage.getItem('weight');
            const height = localStorage.getItem('height');
            
            // แปลง answers เป็นโครงสร้างที่ต้องการสำหรับ backend
            const formattedAnswers = Object.keys(answers).reduce((acc, key) => {
                if (answers[key] && answers[key].ans) {
                    acc[key] = answers[key];
                }
                return acc;
            }, {});
            
            console.log(formattedAnswers)
    
            const res = await axios.post(import.meta.env.VITE_API_FLASK +'/mapSelfCheckin', {
                account_id, pressureData, answers: formattedAnswers, weight, height
            });
            console.log(res.data.message);
            logout();
        } catch (error) {
            console.error("map data error", error);
        }
    };

    const handleToggleChange = () => {
        setIsAnatomySelected(!isAnatomySelected);
    };

    const handleRecordingComplete = useCallback((speech) => {
        const new_speech = speechResult + ' '+ speech
        const updatedAnswers = { 
            ...answers, 
            [currentQuestion]: {
                ans: new_speech, 
                q_id: question_ans[currentQuestion - 1].q_id
            }
        };
        setSpeechResult(new_speech)
        setAnswers(updatedAnswers);
    }, [answers, currentQuestion, question_ans]);

    const handleRefreshRecording = () =>{
        const updatedAnswers = { 
            ...answers, 
            [currentQuestion]: {
                ans: '', 
                q_id: question_ans[currentQuestion - 1].q_id
            }
        };
        setSpeechResult('')
        setAnswers(updatedAnswers);
    }

    const handleAnatomyPosition = useCallback((position) =>{
        const updateAnswers = {
            ...answers,
            [currentQuestion]:{
                ans: position,
                q_id: question_ans[currentQuestion - 1].q_id
            }
        }
        setAnswers(updateAnswers);
    },[answers, currentQuestion, question_ans])

    const handleAnswerChange = useCallback((e) => {
        const updatedAnswers = { 
            ...answers, 
            [currentQuestion]: {
                ans: e.target.value, 
                q_id: question_ans[currentQuestion - 1].q_id
            }
        };
        setAnswers(updatedAnswers);
    }, [answers, currentQuestion, question_ans]);

    const renderAnswerOptions = (answers) => {
        return answers.map((answer, index) => (
            <div key={index} className="flex items-center mt-2">
                <input
                    type="radio"
                    id={`answer_${index}`}
                    name="answer"
                    value={answer}
                    onChange={handleAnswerChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                <label className="ml-2 text-sm font-medium" htmlFor={`answer_${index}`}>{answer}</label>
            </div>
        ));
    };

    const logout = () =>{
        localStorage.clear();
        navigate('/');
    };

    const CheckLOG = () =>{
        console.log(audioPath)
    }
    const CheckAns = () =>{
        console.log(answers)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-teal-100 font-sarabun">
            <div className="w-full max-w-4xl p-4">
            <h1 id='isAns'></h1>
                    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
                        {currentQuestion === 1 && (
                            <>
                                <div className="font-medium text-lg mb-2 flex items-center">{audioPath && <AudioPlayer audioPath={audioPath}/>} {question_ans.length > 0 ? `คำถามที่ ${currentQuestion} : ${question_ans[currentQuestion - 1].question}` : 'Loading...'}</div>
                                <div className="flex items-center mb-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isAnatomySelected} onChange={handleToggleChange} class="sr-only peer"/>
                                        <div class="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium">{isAnatomySelected ? 'ตอบด้วยเสียง' : 'ใช้การเลือกตำแหน่ง'}</span>
                                    </label>
                                </div>

                                {isAnatomySelected ? (
                                    <div className="w-full flex justify-center">
                                        <Anatomy onSelectPosition={handleAnatomyPosition} className="w-full h-auto" />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-sm text-gray-700 mb-2">{speechResult && (speechResult)}</h2>
                                        <div className="flex items-center space-x-4">
                                            <AudioRecordForm onRecordingComplete={handleRecordingComplete} />
                                            {speechResult != '' &&(
                                                    <button onClick={()=>handleRefreshRecording()} className="h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl bg-blue-500 active:bg-blue-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                            )}
                                        </div>
                                    </>
                                )}
                                <button onClick={handleNextQuestion} className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-md active:bg-cyan-700 focus:outline-none shadow-lg transition duration-300 ease-in-out">
                                    ถัดไป
                                </button>
                            </>
                        )}
                        {currentQuestion > 1 && currentQuestion <= question_ans.length && (
                            <>
                                <div className="font-medium text-lg mb-2 flex items-center">{audioPath && <AudioPlayer audioPath={audioPath}/>} {question_ans.length > 0 ? `คำถามที่ ${currentQuestion} : ${question_ans[currentQuestion - 1].question}` : 'Loading...'}</div>
                                {JSON.parse(question_ans[currentQuestion - 1].answer).answers.length > 0 && (
                                    <div className="flex items-center mb-4">
                                        <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isAnatomySelected} onChange={handleToggleChange} class="sr-only peer"/>
                                        <div class="relative w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium">{isAnatomySelected ? 'ตอบด้วยเสียง' : 'ใช้การตัวเลือก'}</span>
                                    </label>
                                    </div>
                                )}
                                {isAnatomySelected ?(
                                    <div className='justify-item-start'>
                                        {renderAnswerOptions(JSON.parse(question_ans[currentQuestion - 1].answer).answers)}
                                    </div>): (
                                        <>
                                            <h2 className="text-sm text-gray-700 mb-2">{speechResult && (speechResult)}</h2>                                          
                                            <div className="flex items-center space-x-4">
                                                <AudioRecordForm onRecordingComplete={handleRecordingComplete} />
                                                {speechResult != '' &&(
                                                    <button onClick={()=>handleRefreshRecording()} className="h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl bg-blue-500 active:bg-blue-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                <div className="flex space-x-2">
                                   <button className="mt-4 px-4 py-2 bg-red-600 active:bg-red-700 text-white rounded-md focus:outline-none shadow-lg transition duration-300 ease-in-out mr-4" onClick={handlePreviousQuestion}>ย้อนกลับ</button>
                                    {currentQuestion < question_ans.length && <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-md active:bg-cyan-700 focus:outline-none shadow-lg transition duration-300 ease-in-out" onClick={handleNextQuestion}>ถัดไป</button>}
                                    {currentQuestion === question_ans.length && <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none shadow-lg transition duration-300 ease-in-out" onClick={handleSubmit} >ส่งคำตอบ</button>}
                                </div>
                            </>
                        )}
                        <ol class="flex items-center w-full mt-5">
                            {question_ans.map((_, index) => (
                                <li
                                    key={index}
                                    class={`flex w-full items-center text-blue-600 ${
                                        index + 1 < currentQuestion ? 'after:bg-green-400' : 'after:bg-gray-100'
                                    } after:content-[''] ${
                                        index === question_ans.length - 1 ? '' : `after:w-full after:h-1 after:border-b ${
                                            index + 1 < currentQuestion ? 'after:border-green-200' : 'after:border-gray-100'
                                        } after:border-4`
                                    } after:inline-block`}
                                >
                                    <span
                                        class={`flex items-center justify-center w-10 h-10 ${
                                            index + 1 < currentQuestion ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-500'
                                        } rounded-full lg:h-12 lg:w-12 shrink-0`}
                                    >
                                        {index + 1 < currentQuestion ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        ) : (
                                            <span class="font-medium">{index + 1}</span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    {/* <button onClick={CheckLOG}>Check Log</button> */}
                    {/* <button onClick={CheckAns}>Check Answer List</button> */}
            </div>
        </div>
    );
}

export default QuestionnaireForm;