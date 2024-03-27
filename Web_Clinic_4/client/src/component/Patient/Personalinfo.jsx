import React, { useState, useEffect } from 'react';
import { useSidebar } from '../Sidebar/sidebarcontext';
import { useAuth } from '../Authentication/authContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Personalinfo.css';
import axios from 'axios';

function Personainfo() {
    const { isSidebarOpen } = useSidebar();
    const { decodeToken } = useAuth();
    const mainClass = `Main${isSidebarOpen ? ' sidebarOpen' : ''}`;

    const [user,setuser] = useState({})
    const [userProfile,setUserProfile] = useState()


    useEffect(() => {
        const getUser = async () =>{
            try{
                const currentUser = await decodeToken()
                const currentAcc = currentUser.account_id;
                // console.log(currentAcc)
                const res_user = await axios.post(import.meta.env.VITE_API+'/patient/getCurrentUserInfo' , {currentAcc})
                setuser(res_user.data)
                // setUserProfile
            }catch(error){
                console.log(error)
            }
        }

        getUser()

        document.documentElement.style.overflowY = 'auto';
        document.documentElement.style.overflowX = 'auto';
        document.body.style.overflowX = 'auto';
    }, []);

    const convertIsoToCustom = (isoDateString) => {
        const date = new Date(isoDateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

    const check = () =>{
        console.log(user)
    }


    return (
        <>
            <div className={mainClass}>

                <div className="main-content">
                    <div className="head-title">
                        <div className="left">
                            <h1>Persona Information</h1>
                            {/* <button onClick={check}>กด</button> */}
                            <ul className="breadcrumb">
                                <li>
                                    <a href="">Home</a>
                                </li>
                                <li><i className="fa-solid fa-angle-right"></i></li>
                                <li>
                                    <a className="active" href="#">Persona Info</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="Personacontainer">

                    <div className="Persona-left">
                       <div className="profilehead">
                            <img src={user.account_id && (import.meta.env.VITE_API+`/UserProfile/acc_profile/${user.account_id}.png`)} alt="" />
                            <div className="name">{user.name}</div>
                            <div className="line"></div>
                       </div>
                       <div className="simpledetail">
                            <div className="simpledata">
                                <div className="topic">
                                    <i className="fa-solid fa-address-book"></i>
                                    <div className="text">ID</div>
                                </div>
                                <div className="data">
                                    {user.account_id}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="simpledata">
                                <div className="topic">
                                    <i className="fa-solid fa-address-card"></i>
                                    <div className="text">CardID</div>
                                </div>
                                <div className="data">
                                    {user.p_id}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="simpledata">
                                <div className="topic">
                                    <i className="fa-solid fa-venus-mars"></i>
                                    <div className="text">Gender</div>
                                </div>
                                <div className="data">
                                    {user.gender === 'M' ? <>Male</> : <>Female</>}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="simpledata">
                                <div className="topic">
                                    <i className="fa-solid fa-phone"></i>
                                    <div className="text">Phone</div>
                                </div>
                                <div className="data">
                                    {user.phoneNumber}
                                </div>
                            </div>
                       </div>
                    </div>

                    <div className="Persona-right">
                        <div className="patientdetail">
                            <div className="patientdata">
                                <div className="topic">
                                    <i className="fa-solid fa-cake-candles"></i>
                                    <div className="text">BirthDate</div>
                                </div>
                                <div className="data">
                                    {convertIsoToCustom(user.birthDate)}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="patientdata">
                                <div className="topic">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div className="text">Address</div>
                                </div>
                                <div className="data">
                                    {user.address}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="patientdata">
                                <div className="topic">
                                    <i className="fa-solid fa-suitcase"></i>
                                    <div className="text">Occupation</div>
                                </div>
                                <div className="data">
                                    {user.occupation}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="patientdata">
                                <div className="topic">
                                <i className="fa-solid fa-face-sad-tear"></i>
                                    <div className="text">Congenital Disease</div>
                                </div>
                                <div className="data">
                                    {user.congenital_disease}
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="patientdata">
                                <div className="topic">
                                <i className="fa-solid fa-disease"></i>
                                    <div className="text">Allergy</div>
                                </div>
                                <div className="data">
                                    {user.allergy}
                                </div>
                            </div>
                        </div>
                        <div className="contactfooter">
                            <div className="text">กรณีข้อมูลไม่ถูกต้องกรุณาติดต่อกลุ่มงานทะเบียนฯ โทร 1150</div>
                        </div>
                    </div>
                </div>



            </div>

        </>
    )
}

export default Personainfo