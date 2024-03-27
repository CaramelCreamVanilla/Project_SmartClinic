import React, { useState  , useEffect } from 'react';
import axios from 'axios';
import JsonCSS from './style.module.css'

function Pressure() {
    const [acc,setAcc] = useState()
    const [pid,setPid] = useState('')
    const [sys,setSys] = useState()
    const [dia,setDia] = useState()
    const [pulse,setPulse] = useState()
    const [dateTime,setDateTime] = useState()
    const [weight,setWeight] = useState()
    const [height,setHeight] = useState()

    const [getPatient,setGetPatient] = useState([])

    useEffect(()=>{
        const getPatient = async () =>{
            try{
                const response = await axios.get(import.meta.env.VITE_API_FLASK+ '/getAcc');
                setGetPatient(response.data.result)
                // console.log(response.data.result)
            }catch(error){
                console.error('Get patient failed:', error.response.data);
            }
        }
        getPatient()
    },[])

    const CheckJson = async () =>{
        try{
            const response = await axios.get(import.meta.env.VITE_JSON_SERVER+'/ML7')
            console.log(response)
            if(response.data.length >= 30){
                // console.log('delete')
                const firstID = response.data[0].id;
                await axios.delete(import.meta.env.VITE_JSON_SERVER+`/ML7/${firstID}`)
            }
        }catch(error){
            console.error('Error get data:', error);
        }
    }

    const Post = async (jData) =>{
        try{
            CheckJson();
            const response = await axios.post(import.meta.env.VITE_JSON_SERVER+'/ML7', jData)
            console.log('Data added successfully:', response.data);
        }catch(error){
            console.error('Error posting data:', error);
        }
    }

    const formatDateTime = (dateInput) =>{
        const date = new Date(dateInput);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = "00";

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        setDateTime(formattedDateTime)
    }

    const sendData = async (e) =>{
        e.preventDefault();
        const jData = {
            "account_id": acc,
            "p_id": pid,
            "SYS": sys,
            "DIA": dia,
            "Pulse": pulse,
            "Date": dateTime,
            "weight" : weight,
            "height" : height
          };
          await Post(jData)
          location.reload();
    }

    const handleAccountChange = (e) => {
        const selectedAccountId = e.target.value;
        setAcc(selectedAccountId);
    
        // ค้นหา p_id ที่เกี่ยวข้องจาก getPatient
        const relatedPatient = getPatient.find(patient => patient.account_id == selectedAccountId);
        if (relatedPatient) {
            setPid(relatedPatient.p_id); // อัปเดต state ของ p_id
        } else {
            setPid(''); // รีเซ็ต p_id ถ้าไม่พบ
        }
    };

  return (
    <div className={JsonCSS['container']}>
        <form className={JsonCSS['form_']} onSubmit={sendData}>
            <select required className={JsonCSS['select_box']} onChange={handleAccountChange}>
                <option value="">Select Account ID</option>
                {getPatient.map((patient, index) => (
                    <option key={index} value={patient.account_id}>{patient.account_id}</option>
                ))}
            </select>
            <input readOnly className={JsonCSS['input_box']} type="text" value={pid} placeholder='p_id' />
            <input required className={JsonCSS['input_box']} type="number" placeholder='Weight' step="0.01" onChange={(e) => setWeight(e.target.value)}/>
            <input required className={JsonCSS['input_box']} type="number" placeholder='Height' step="0.01" onChange={(e) => setHeight(e.target.value)}/>
            <input required className={JsonCSS['input_box']} type="number" placeholder='SYS' onChange={(e) => setSys(e.target.value)}/>
            <input required className={JsonCSS['input_box']} type="number" placeholder='DIA' onChange={(e) => setDia(e.target.value)}/>
            <input required className={JsonCSS['input_box']} type="number" placeholder='Pulse' onChange={(e) => setPulse(e.target.value)}/>
            <input required className={JsonCSS['input_box']} type="datetime-local" placeholder='Date' onChange={(e) => formatDateTime(e.target.value)}/>
            <input className={JsonCSS['input_box']} type='submit' value='submit'/>
        </form>
    </div>
  )
}

export default Pressure