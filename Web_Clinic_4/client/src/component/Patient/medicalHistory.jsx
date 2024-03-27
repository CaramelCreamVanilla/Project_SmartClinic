import React, { useState, useEffect } from 'react';
import { useSidebar } from '../Sidebar/sidebarcontext.jsx';
import { useAuth } from '../Authentication/authContext.jsx'
import './medicalhistory.css';
import Anatomy from './anatomy.jsx';
import axios from 'axios';


function Medicalhistory() {
    const { isSidebarOpen } = useSidebar();
    const [activeIndex, setActiveIndex] = useState(null);
    const mainClass = `Main${isSidebarOpen ? ' sidebarOpen' : ''}`;
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const bodyParts = ["head", "left-shoulder", "right-shoulder", "left-arm", "right-arm", "chest", "stomach", "left-leg", "right-leg", "left-hand", "right-hand", "left-foot", "right-foot"];

    const [patientCase, setPatientCase] = useState([]);
    const [selectPos,setSelectPos] = useState([]);
    const [historyDetail,setHistoryDetail] = useState({})
    const [pressureDetail,setPressureDetail] = useState([])
    const [kioskSpeech,setKioskSpeech] = useState([])
    const { decodeToken } = useAuth();
    const [detaildate, setdetaildate] = useState('');

    const [question,setQuestion] = useState()

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCases, setFilteredCases] = useState([]);

    useEffect(() => {
      const getPatientCase = async () => {
        try {
          const current_user = await decodeToken();
          const currentAcc = current_user.account_id;
          const res_case = await axios.post(import.meta.env.VITE_API + '/patient/getPatientCase', { currentAcc });
          const res_question = await axios.get(import.meta.env.VITE_API + '/question/getQuestion')
    
          setQuestion(res_question.data)
          setPatientCase(res_case.data);
    
          // Assuming res_case.data has at least one item for safety
          if (res_case.data && res_case.data.length > 0) {
            setdetaildate(convertDateToLongFormat(convertIsoToCustom(res_case.data[0].date)))
            setHistoryDetail(res_case.data[0])
            console.log(res_case.data[0].date)
            setPressureDetail(JSON.parse(res_case.data[0].pressure))
    
            let data_kiosk = JSON.parse(res_case.data[0].kiosk_speech)
            let arrayOfObjects = Object.values(data_kiosk);
    
            if (bodyParts.some(part => data_kiosk[1].ans.includes(part))) {
              // console.log('have part')
              setSelectPos(data_kiosk[1].ans.split(", "))
              setKioskSpeech(arrayOfObjects.slice(1))
            } else {
              // console.log('not have part')
              setSelectPos([])
              setKioskSpeech(arrayOfObjects)
            }
          }
    
        } catch (error) {
          console.log(error);
        }
      };
    
      getPatientCase();
    
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.overflowX = 'auto';
      document.body.style.overflowX = 'auto';
    
    }, []); 

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(()=>{
      const filtercase = () =>{
        const lowercasedQuery = searchQuery.toLowerCase();

        const filtered = patientCase.filter((item)=>{
          const dateString = convertIsoToCustom(item.date);
          return dateString.toLowerCase().includes(lowercasedQuery);
        })
        setFilteredCases(filtered);
      }
      filtercase();
    },[searchQuery,patientCase])

    const convertTime = (TimeStamp) =>{
      const date = new Date(TimeStamp);
  
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}น.`;
    }

    const convertIsoToCustom = (isoDateString) => {
      const date = new Date(isoDateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const convertDateToLongFormat = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(year, month - 1, day);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const longFormat = date.toLocaleDateString('en-EN', options);
      return longFormat;
    };

    const toggleDetails = index => {
      setActiveIndex(activeIndex === index ? null : index);
      setdetaildate(convertDateToLongFormat(convertIsoToCustom(patientCase[index].date)));
      setHistoryDetail(patientCase[index])

      setPressureDetail(JSON.parse(patientCase[index].pressure))

      let data_kiosk = JSON.parse(patientCase[index].kiosk_speech)
      let arrayOfObjects = Object.values(data_kiosk);


      if(bodyParts.some(part => data_kiosk[1].ans.includes(part))){
        // console.log('have part')
        setSelectPos(data_kiosk[1].ans.split(", "))
        setKioskSpeech(arrayOfObjects.slice(1))
      }else{
        // console.log('not have part')
        setSelectPos([])
        setKioskSpeech(arrayOfObjects)
      }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

    const check = () =>{
      console.log(kioskSpeech)
    }

    return (
        <>
          <div className={mainClass}>
            <div className="main-content">
                <div className="head-title">
                    <div className="left">
                        <h1>Medical History</h1>
                        {/* <button onClick={check}>กด</button> */}
                        <ul className="breadcrumb">
                            <li>
                                <a href="">Home</a>
                            </li>
                            <li><i className="fa-solid fa-angle-right"></i></li>
                            <li>
                                <a className="active" href="#">Medical History</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

          <div className="ContainnerMedHis">

              <div className="MedHisMenu">
                  <div className="searchboxarea">
                      <div className="searchbox">
                          <i className="fa-solid fa-magnifying-glass"></i>
                          <input className="search-input" type="search" placeholder="Search..." value={searchQuery} onChange={handleSearchChange }/>
                      </div>
                  </div>
                  <div className="HistoryList">
                      {filteredCases.map((item , index) => (
                        <>
                        <div key={index} className={`boxlist ${activeIndex === index && windowWidth <= 900 ? 'changeborder' : ''}`} onClick={() => toggleDetails(index)}>
                            <div className="text">{(convertIsoToCustom(item.date))} เวลา {convertTime(item.date)}</div>
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                              {activeIndex === index && windowWidth <= 900 && (
                                  <div className="ItemDetails">
                                      <div className="MedHisDetail-header">
                                          <div className="text">Detail for : {convertDateToLongFormat(convertIsoToCustom(item.date))}</div>
                                      </div>
                                      <div className="MedHisDetail-data">
                                          <div className="Meddatainfo">
                                              <div className="Meddata">{JSON.parse(historyDetail.pressure).DIA}</div>
                                              <div className="MedInfo">ความดันขณะหัวใจบีบตัว</div>
                                          </div>
                                          <div className="Meddatainfo">
                                              <div className="Meddata">{JSON.parse(historyDetail.pressure).SYS}</div>
                                              <div className="MedInfo">ความดันขณะหัวใจคลายตัว</div>
                                          </div>
                                          <div className="Meddatainfo">
                                              <div className="Meddata">{JSON.parse(historyDetail.pressure).Pulse}</div>
                                              <div className="MedInfo">อัตราการเต้นของหัวใจ</div>
                                          </div>
                                      </div>
                                      <div className="MedHisDetail-data-two">
                                          <div className="Meddatainfo">
                                              <div className="Meddata">{historyDetail.weight_check_in}</div>
                                              <div className="MedInfo">น้ำหนัก</div>
                                          </div>
                                          <div className="Meddatainfo">
                                              <div className="Meddata">{historyDetail.height_check_in}</div>
                                              <div className="MedInfo">ส่วนสูง</div>
                                          </div>
                                      </div>
                                      <div className="MedHisDetail-data-three">
                                          <div className="kioskdata">
                                              <div className="topic">
                                                  Data from Kiosk :
                                              </div>
                                              <div className="data">
                                              {
                                                kioskSpeech && (kioskSpeech.map((item, index) => {
                                                  return (
                                                    <> {/* Added a return statement here */}
                                                      <p className="question">{index + 1}. {question.map((q)=>(q.q_id === item.q_id && <>{q.question}</>))}</p><p>{item.ans}</p> 
                                                    </>
                                                  );
                                                }))
                                              }
                                            </div>
                                          </div>
                                      </div>
                                      <div className="MedHisDetail-anatomy">
                                          <div><Anatomy selectedPart={selectPos}/></div>
                                      </div>
                                  </div>

                              )}
                          </>
                      ))}
                  </div>
              </div>

              <div className="MedHisDetail">
                  <div className="MedHisDetail-header">
                      <div className="text">Detail for : {detaildate}</div>
                  </div>
                  <div className="MedHisDetail-data">
                      <div className="Meddatainfo">
                          <div className="Meddata">{pressureDetail ? pressureDetail.DIA : <>-</>}</div>
                          <div className="MedInfo">ความดันขณะหัวใจบีบตัว</div>
                      </div>
                      <div className="Meddatainfo">
                          <div className="Meddata">{pressureDetail ? pressureDetail.SYS : <>-</>}</div>
                          <div className="MedInfo">ความดันขณะหัวใจคลายตัว</div>
                      </div>
                      <div className="Meddatainfo">
                          <div className="Meddata">{pressureDetail ? pressureDetail.Pulse : <>-</>}</div>
                          <div className="MedInfo">อัตราการเต้นของหัวใจ</div>
                      </div>
                  </div>
                  <div className="MedHisDetail-data-two">
                      <div className="Meddatainfo">
                          <div className="Meddata">{historyDetail.weight_check_in}</div>
                          <div className="MedInfo">น้ำหนัก</div>
                      </div>
                      <div className="Meddatainfo">
                          <div className="Meddata">{historyDetail.height_check_in}</div>
                          <div className="MedInfo">ส่วนสูง</div>
                      </div>
                  </div>
                  <div className="MedHisDetail-data-three">
                      <div className="kioskdata">
                          <div className="topic">
                              Data from Kiosk :
                          </div>
                          <div className="data">
                          {
                            kioskSpeech && (kioskSpeech.map((item, index) => {
                              return (
                                <> {/* Added a return statement here */}
                                  <p className="question">{index + 1}. {question.map((q)=>(q.q_id === item.q_id && <>{q.question}</>))}</p><p>{item.ans}</p> 
                                </>
                              );
                            }))
                          }
                          </div>
                      </div>
                  </div>
                  <div className="MedHisDetail-anatomy">
                      <div><Anatomy selectedPart={selectPos}/></div>
                  </div>
              </div>
          </div>

          </div>
        </>
    )
}

export default Medicalhistory