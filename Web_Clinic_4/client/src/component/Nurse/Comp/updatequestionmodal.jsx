import React, { useState , useEffect} from 'react';
import ReactDOM from 'react-dom'; 
import './addquestionmodal.css';
import Swal from 'sweetalert2';
import { useAuth } from '../../Authentication/authContext';

const Updatequestionmodal = ({ onClose , questionData}) => {
    const {updateQuestion} = useAuth();
    const [question, setQuestion] = useState(questionData.question);
    const [formAnswer, setFormAnswer] = useState({
        type: JSON.parse(questionData.answer).type,
        answers: JSON.parse(questionData.answer).answers,
    });
    const [numberOfChoices, setNumberOfChoices] = useState((JSON.parse(questionData.answer).answers).length);

    const suretoupdate = () => {
        Swal.fire({
            title: "Are you sure ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes ",
            customClass: {
                popup: 'my-custom-swal'
            }
        }).then( async (result) => {
            if (result.isConfirmed) {
                await updateQuestion(question,formAnswer,questionData.q_id).then(async (status)=>{
                    if (status === 200) {
                        Swal.fire({
                            title: "Added!",
                            text: "Your question has been updated.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Failed!",
                            text: "Your question could not be updated.",
                            icon: "error"
                        });
                    }
                }).catch((error) => {
                    // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong: " + error,
                        icon: "error"
                    });
                });
            }
            setFormAnswer({
                type: '',
                answers: [''],
            })
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(formAnswer.type === 'YesNo'){
            const questionLowercase = question.toLowerCase();
            if(questionLowercase.includes('เคย')){
                formAnswer.answers = ["เคย","ไม่เคย"]
            }else if((questionLowercase).includes('มี')){
                formAnswer.answers = ["มี","ไม่มี"]
            }else if((questionLowercase).includes('ใช่')){
                formAnswer.answers = ["ใช่","ไม่ใช่"]
            }else{
                formAnswer.answers = ["ใช่","ไม่ใช่"]
            }
        }
        suretoupdate();
    };
      const handleSelectChange = (e) => {
        const { value } = e.target;
        setFormAnswer({
            ...formAnswer,
            type: value,
            answers: value === 'Choice' ? [''] : [], // Reset answers for 'Choice'
        });
    };

    useEffect(() => {
        if (formAnswer.type === 'Choice') {
            setFormAnswer((prevFormAnswer) => ({
                ...prevFormAnswer,
                answers: Array.from({ length: numberOfChoices }, (_, i) => prevFormAnswer.answers[i] || ''),
            }));
        }
    }, [numberOfChoices, formAnswer.type]);

    const handleNumberOfChoicesChange = (e) => {
        if(parseInt(e.target.value) > 7){
            setNumberOfChoices("7");
        }else if(parseInt(e.target.value) < 1){
            setNumberOfChoices("1");
        }else{
            setNumberOfChoices(e.target.value);
        }
    };

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...formAnswer.answers];
        newAnswers[index] = event.target.value;
        setFormAnswer({ ...formAnswer, answers: newAnswers });
    };

    const check = () =>{
        // console.log((JSON.parse(questionData.answer).answers).length)
        console.log(questionData.q_id)
    }

    const modalContent = (
        <div className="modal-backdrop">
            <div className="modal-content">

                <p>Add Question</p>
                <button onClick={check}>กด</button>
                <i className="fa-solid fa-xmark" onClick={onClose}></i>

                <form onSubmit={handleSubmit}>
                    <div className="formaddquestion">
                        <div className="one-group-horizontal">
                            <div className="input-group">
                                <label>Question</label>
                                <input type="text" name="" placeholder="Your Question" required pattern=".{3,150}" value={question} onChange={(e) => setQuestion(e.target.value)}/>
                            </div>
                        </div>
                        <div className="one-group-horizontal">
                            <div className="input-group">
                            <label>Type</label>
                                <select name="Type" id="Type" value={formAnswer.type} onChange={handleSelectChange}>
                                    <option value="">Select Type</option>
                                    <option value="Choice">Choice</option>
                                    <option value="YesNo">Yes/No</option>
                                    <option value="OnlyVoice">OnlyVoice</option>
                                </select>
                            </div>
                        </div>
                        {formAnswer.type === 'Choice' &&(
                            <>
                                <div className="one-group-horizontal">
                                    <div className="input-group">
                                        <label>Number of Choices</label>
                                        <input type="number" value={numberOfChoices} onChange={handleNumberOfChoicesChange} />
                                    </div>
                                </div>
                            </>
                        )}

                        {formAnswer.type === 'Choice' && formAnswer.answers.map((answer, index) => (
                            <div key={index}>
                                <label className="topic-choices">Choices {index+1}</label>
                                <div className="choiceinput">
                                    <input
                                        required
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(index, e)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        <div className="btnadduser">
                            <input type="submit" value="Submit" />
                            <input type="button" value="Cancel" onClick={onClose} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default Updatequestionmodal