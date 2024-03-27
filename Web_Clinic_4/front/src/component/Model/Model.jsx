import React, { useState } from 'react';
import axios from 'axios';

function AudioRecordForm({onRecordingComplete}) {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  // const [audioData, setAudioData] = useState(null);
  // const [speechResult,setSpeechResult] = useState('');

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { //เช็คว่า Browser นั้นใช้ Microphone ได้มั้ย
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); //ขอเข้าถึง Mic โดยระบุว่าขอเข้าถึง audio
        const recorder = new MediaRecorder(stream); //ตัวบันทึกเสียง
        let audioChunks = [];

        recorder.ondataavailable = (e) => {
          audioChunks.push(e.data); //e.data เป็นข้อมูล Blob(Binary Large Object)  แล้วยัดลงใน audioChunks
          console.log(audioChunks)
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); //สร้าง Blob ใหม่จาก audioChunks กำหนดให้เป็น .wav
          // setAudioData(audioBlob);
          audioChunks = [];
          const formData = new FormData(); //ใช้เตรียมข้อมูลให้ส่งเป็น Req ไปหา Server //สร้างชุดข้อมูลแบบ {key:value}
          formData.append('file', audioBlob, 'audio.wav'); //{file:audioBlob} กำหนดชื่อไฟล์ว่า audio
          // console.log(formData)
          try {
            const response = await axios.post(import.meta.env.VITE_API_FLASK +'/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data', //ประเภทของเนื้อหาที่ส่งไปเป็นแบบ multipart/form-data //ใช้บอก Server ว่า ที่ส่งไปนั้นเป็นไฟล์
              },
            });
            console.log(response.data);
            // setSpeechResult(response.data.output)
            if (onRecordingComplete) { // ตรวจสอบว่ามีฟังก์ชันมั้ย ก่อนเรียกใช้ 
              onRecordingComplete(response.data.output); //Call back Function ไปหาหน้าที่เรียกใช้
            }
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    } else {
      alert('Microphone access is not supported by this browser.'); //ถ้าใช้ Mic ไม่ได้
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      <button 
        onMouseDown={handleStartRecording} 
        onMouseUp={handleStopRecording}
        onTouchStart={handleStartRecording}//onTouch ใช้รองรับพวก มือถือ ไอแพด
        onTouchEnd={handleStopRecording}
        className="h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl bg-blue-500 active:bg-blue-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
          <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
        </svg>
      </button>
    </div>
  );
}

export default AudioRecordForm;