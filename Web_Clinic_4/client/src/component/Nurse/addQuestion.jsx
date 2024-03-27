import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/authContext';
import axios from 'axios';

function CreateQuestionForm() {

    const {addQuestion , decodeToken} = useAuth()

    const [question, setQuestion] = useState('');
    const [formAnswer, setFormAnswer] = useState({
        type: '',
        answers: [''],
    });

//Choice Question
    const [numberOfChoices, setNumberOfChoices] = useState(1);

    const handleSelectChange = (e) => {
        const { value } = e.target;
        setFormAnswer({
            ...formAnswer,
            type: value,
            answers: value === 'Choice' ? [''] : [], // Reset answers for 'Choice'
        });
    };

    const handleNumberOfChoicesChange = (e) => {
        const num = Math.max(1, parseInt(e.target.value, 10) || 1);
        setNumberOfChoices(num);
    };

    useEffect(() => {
        if (formAnswer.type === 'Choice') {
            setFormAnswer((prevFormAnswer) => ({
                ...prevFormAnswer,
                answers: Array.from({ length: numberOfChoices }, (_, i) => prevFormAnswer.answers[i] || ''),
            }));
        }
    }, [numberOfChoices, formAnswer.type]);

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...formAnswer.answers];
        newAnswers[index] = event.target.value;
        setFormAnswer({ ...formAnswer, answers: newAnswers });
    };

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(formAnswer.type === 'Choice'){
            addQuestion(question,formAnswer)
        }else if(formAnswer.type === 'YesNo'){
            formAnswer.answers = ["มี","ไม่มี"]
            addQuestion(question,formAnswer)
        }else{
            addQuestion(question,formAnswer)
        }
    }

    const checktoken = async () =>{
        const res = await decodeToken()
        console.log(res.role_id)
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Question:</label>
                <input required type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div>
                <label>Type:</label>
                <select required name="Type" value={formAnswer.type} onChange={handleSelectChange}>
                    <option value="">Select Type</option>
                    <option value="Choice">Choice</option>
                    <option value="YesNo">Yes/No</option>
                    <option value="OnlyVoice">Only Voice</option>
                </select>
            </div>
            {formAnswer.type === 'Choice' && (
                <div>
                    <label>Number of Choices:</label>
                    <input
                        type="number"
                        value={numberOfChoices}
                        onChange={handleNumberOfChoicesChange}
                        min="1"
                    />
                </div>
            )}
            {formAnswer.type === 'Choice' && formAnswer.answers.map((answer, index) => (
                <div key={index}>
                    <input
                        required
                        type="text"
                        value={answer}
                        onChange={(e) => handleAnswerChange(index, e)}
                    />
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
        <button onClick={checktoken}>กด</button>
        </>
    );
}

export default CreateQuestionForm;