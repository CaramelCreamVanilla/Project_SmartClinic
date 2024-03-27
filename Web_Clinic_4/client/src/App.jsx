import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './component/Authentication/authContext';
import { useNavigate } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const { logout , user } = useAuth();
  const navigate = useNavigate();

  const AddText = async (e) => {
    e.preventDefault();
    
    try {
      // Send a POST request to the server to add the new text
      await axios.post('http://localhost:3000/addTxt', { text });
      
      // After successfully adding the text, you may want to update the UI by fetching the updated data
      const response = await axios.get('http://localhost:3000/getTxt');
      setData(response.data);

      // Clear the input field after adding text
      setText('');
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

    const clickToTalk = () =>{
    try {
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.lang = 'th-TH'
      recognitionInstance.continous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.addEventListener('result', (event) => {
        console.log(event.results[0][0].transcript);
        setText(event.results[0][0].transcript)
      });

      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (error) {
      console.error('Speech recognition not supported:', error);
    }
    };

    const Check_token = () =>{
      console.log(user)
    }

    const handleLogout = () =>{
      logout();
      navigate('/login')
    }


  return (
    <>
    <div>
      <h1>Data from MySQL Database</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.text_from_speech}</li>
        ))}
      </ul>
      <form onSubmit={AddText}>
        {/* <input type='text' value={text} onChange={(e) => setText(e.target.value)} /> */}
        <button type='submit'>Add Text</button>
      </form>
      <button onClick={clickToTalk} >Click to Speack !!</button>
      <button onClick={Check_token} >Check Token</button>
      <button onClick={handleLogout} >Logout</button>
      Result : {user.role_id}<br/>
    </div>
    </>
  );
}

export default App;