import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import LoginCSS from "./Login.module.css"
import AudioPlayer from '../QuestionForm/audioPlayer';
function Login() {
  const [account_id, setAccount_id] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [inputFocus, setInputFocus] = useState('');

  const keys = [
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 4, label: '4' },
    { id: 5, label: '5' },
    { id: 6, label: '6' },
    { id: 7, label: '7' },
    { id: 8, label: '8' },
    { id: 9, label: '9' },
    { id: 'backspace', label: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>
   , additionalStyles: 'bg-red-500 active:bg-red-700 '},
    { id: 0, label: '0' },
    { id: 'enter', label: '✓', additionalStyles: 'bg-green-500 active:bg-green-700'  },
  ];

  const timeCheck = (time) =>{
    const date1 = new Date()
    const date2 = new Date(time)
    const difference = Math.abs(date1 - date2);
    const minutesDifference = difference / (1000 * 60);
    return minutesDifference <= 30;
  }

  const handleSubmit = async () => {
    const alertStyle = 'px-4 py-3 rounded relative my-3 text-center font-medium text-sm';
    try {
      const response = await axios.post(import.meta.env.VITE_API_FLASK + '/login', { account_id, password });
      if(response.data.role_id == 'P'){
        const url = import.meta.env.VITE_JSON_SERVER+`/ML7?account_id=${account_id}`;
        const response_json = await axios.get(url);
        console.log(response_json.data[response_json.data.length - 1])
        if(response_json.data.length != 0 && timeCheck(response_json.data[response_json.data.length - 1].Date)){
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('account_id', response.data.account_id);
          localStorage.setItem('weight' , response_json.data[response_json.data.length - 1].weight)
          localStorage.setItem('height' , response_json.data[response_json.data.length - 1].height)
          const pressureData = {
            "id": response_json.data[response_json.data.length - 1].id,
            "account_id": response_json.data[response_json.data.length - 1].account_id,
            "p_id": response_json.data[response_json.data.length - 1].p_id,
            "SYS": response_json.data[response_json.data.length - 1].SYS,
            "DIA": response_json.data[response_json.data.length - 1].DIA,
            "Pulse": response_json.data[response_json.data.length - 1].Pulse,
            "Date": response_json.data[response_json.data.length - 1].Date
          }
          localStorage.setItem('pressure_json' , JSON.stringify(pressureData))
          navigate('/form')
        }else{
          document.getElementById('alert').className = `${alertStyle} font-sarabun font-semibold bg-yellow-100 text-yellow-700 `;
          document.getElementById('alert').innerHTML = 'ผลความดันของคุณเก่าเกินไป<br>กรุณาไปวัดความดันใหม่อีกครั้ง';
        }
      }else{
        document.getElementById('alert').className = `${alertStyle} font-sarabun font-semibold bg-yellow-100 text-yellow-700 `;
        document.getElementById('alert').innerHTML = 'คุณไม่ได้รับอนุญาตให้ใช้'
      }
    } catch (error) {
      document.getElementById('alert').className = `${alertStyle} font-sarabun font-semibold bg-yellow-100 text-yellow-700 `;
      document.getElementById('alert').innerText = 'Account Id หรือ Password ไม่ถูกต้อง';
    }
  };

  const handleNumberClick = (number) => {
    if (inputFocus === 'account_id') {
      setAccount_id(prev => prev + number);
    } else if (inputFocus === 'password') {
      setPassword(prev => prev + number);
    }
  }


  const handleDeleteClick = () => {
    if (inputFocus === 'account_id') {
      setAccount_id(prev => prev.slice(0, -1));
    } else if (inputFocus === 'password') {
      setPassword(prev => prev.slice(0, -1));
    }
  }

  const handleKeypadPress = (key) => {
    if (key === 'backspace') {
      handleDeleteClick()
    } else if (key === 'enter') {
      handleSubmit()
    } else {
      handleNumberClick(key)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-teal-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="font-kodchasan text-4xl font-bold text-center mb-4">CLINIC</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="cardId" className="font-kanit block text-base text-gray-700" >Card ID</label>
            <input type="text" id="cardId" value={account_id} onChange={(e) => setAccount_id(e.target.value)} onFocus={() => setInputFocus('account_id')} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="password" className="font-kanit block text-base text-gray-700">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setInputFocus('password')} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
          </div>
        </form>
        <div id="alert"><br/></div>
        <div className="grid grid-cols-3 gap-4 ">
          {keys.map((key) => (
            <button
              key={key.id}
              className={`font-semibold h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl ${key.additionalStyles ? key.additionalStyles : 'bg-cyan-500 active:bg-cyan-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-200 focus:ring-white`}
              onClick={() => handleKeypadPress(key.id)}
            >
            {key.label}
          </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;