import React, { useState } from 'react';
import ReactDOM from 'react-dom'; 
import './addusermodal.css';
import './viewusermodal.css';

const Viewusermodal = ({ onClose , userdata}) => {

    const check = () =>{
        console.log(userdata)
    }

    const formatPhonenum = (phoneNum) =>{
        const cleanNumber = phoneNum.replace(/\D/g, '');
        const formattedNumber = cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        return formattedNumber;
    }

    const convertDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
    
    const modalContent = (
            <div className="modal-backdrop">
                <div className="modal-content">
                    {/* <button onClick={check}>df</button> */}
    
                    <p>Information User</p>
                    <i className="fa-solid fa-xmark" onClick={onClose}></i>
    
                    <div className="informationuser-header">
                        <div className="picture">
                            <img src={import.meta.env.VITE_API+`/UserProfile/acc_profile/${userdata.account_id}.png`} alt="" />
                        </div>
                        <div className="box-header">
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-star"></i>
                                    <div className="title">Role :</div>
                                </div>
                                <div className="infodetail">
                                    {userdata.role_id == 'P' ?(<>Patient</>):(<>Nurse</>)}
                                </div>
                            </div>
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-lock"></i>
                                    <div className="title">Password :</div>
                                </div>
                                <div className="infodetail">
                                    {userdata.password}
                                </div>
                            </div>
    
                        </div>
                    </div>
    
                    <div className="informationuser">
                        <div className="two-group-info">
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-user"></i>
                                    <div className="title">Name :</div>
                                </div>
                                <div className="infodetail">
                                    {userdata.name}
                                </div>
                            </div>
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-venus-mars"></i>
                                    <div className="title">Gender :</div>
                                </div>
                                <div className="infodetail">
                                    {userdata.gender === 'M' ? (<>Male</>):(<>Female</>)}
                                </div>
                            </div>
                        </div>
    
                        <div className="two-group-info">
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-phone"></i>
                                    <div className="title">Phone :</div>
                                </div>
                                <div className="infodetail">
                                    {formatPhonenum(userdata.phoneNumber)}
                                </div>
                            </div>
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-cake-candles"></i>
                                    <div className="title">Birthday :</div>
                                </div>
                                <div className="infodetail">
                                    {convertDate(userdata.birthDate)}
                                </div>
                            </div>
                        </div>
    
                        <div className="one-group-info">
                            <div className="boxinfo">
                                <div className="infohead">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div className="title">Address :</div>
                                </div>
                                <div className="infodetail">
                                    {userdata.address}
                                </div>
                            </div>
                        </div>
    
                        {userdata.role_id === 'P' &&(
                            <>
                            <div className="one-group-info">
                                <div className="boxinfo">
                                    <div className="infohead">
                                        <i className="fa-solid fa-address-card"></i>
                                        <div className="title">CardID :</div>
                                    </div>
                                    <div className="infodetail">
                                        {userdata.p_id}
                                    </div>
                                </div>
                            </div>
    
                            <div className="two-group-info">
                                <div className="boxinfo">
                                    <div className="infohead">
                                        <i className="fa-solid fa-suitcase"></i>
                                        <div className="title">Occupation :</div>
                                    </div>
                                    <div className="infodetail">
                                        {userdata.occupation}
                                    </div>
                                </div>
                                <div className="boxinfo">
                                    <div className="infohead">
                                        <i className="fa-solid fa-face-sad-tear"></i>
                                        <div className="title">Congenital Disease :</div>
                                    </div>
                                    <div className="infodetail">
                                        {userdata.congenital_disease}
                                    </div>
                                </div>
                            </div>
    
                            <div className="one-group-info">
                                <div className="boxinfo">
                                    <div className="infohead">
                                        <i className="fa-solid fa-disease"></i>
                                        <div className="title">Allergy :</div>
                                    </div>
                                    <div className="infodetail">
                                        {userdata.allergy}
                                    </div>
                                </div>
                            </div>
                            </>
                        )}
                        
    
                    </div>
    
                </div>
            </div>
        
    );


    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default Viewusermodal