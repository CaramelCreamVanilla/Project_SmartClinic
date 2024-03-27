import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useSidebar } from './sidebarcontext';
import { useAuth } from '../Authentication/authContext';
import { useSidebar } from '../Sidebar/sidebarcontext';

function Sidebar() {

    const {logout , decodeToken} = useAuth();
    const {isSidebarOpen , toggleSidebar } = useSidebar();
    const [role,setRole] = useState('')
    const [acc_id,setAcc_id] = useState('')

    const [activeMenu, setActiveMenu] = useState(() => localStorage.getItem('activeMenu') || '');
    

    const handleMenuClick = (menuName) => {
        setActiveMenu(menuName);
    };

    useEffect(()=>{
        const getRole = async () =>{
            const fecthRole = (await decodeToken()).role_id
            const fecthAcc = (await decodeToken()).account_id
            console.log(fecthRole)
            setRole(fecthRole)
            setAcc_id(fecthAcc)

            if(!localStorage.getItem('activeMenu')){
                switch(fecthRole) {
                    case 'A':
                      setActiveMenu('Dashboard');
                      break;
                    case 'N':
                      setActiveMenu('Question');
                      break;
                    case 'P':
                      setActiveMenu('Medical Histories');
                      break;
                }     
            }
        }
        getRole();
    },[])

    useEffect(() => {
        localStorage.setItem('activeMenu', activeMenu);
    }, [activeMenu]);

    const check = async () =>{
        console.log(activeMenu)
    }
    

    return (
        <div className=''>
            <section id="sidebar" className={isSidebarOpen ? '' : 'hide'}>
                <a href="#" className="brand">
                    <svg viewBox="0 0 512 512"><g><path fill="#1fc091" d="M317.633 56.851H194.37a51.19 51.19 0 0 0-51.134 51.129v38.454h33.724V107.98a17.425 17.425 0 0 1 17.41-17.4h123.263a17.424 17.424 0 0 1 17.409 17.405v38.454h33.725V107.98a51.191 51.191 0 0 0-51.134-51.129z" opacity="1" data-original="#1fc091"></path><rect width="496" height="317.092" x="8" y="138.057" fill="#008d67" rx="24.215" opacity="1" data-original="#008d67"></rect><path fill="#019f74" d="M479.785 138.057H49.69v251.358a40.709 40.709 0 0 0 40.71 40.709H504V162.272a24.214 24.214 0 0 0-24.215-24.215z" opacity="1" data-original="#019f74"></path><path fill="#ffffff" d="M345.36 264.822h-57.654v-57.641h-63.412v57.641H166.64v63.413h57.654v57.653h63.412v-57.653h57.654z" opacity="1" data-original="#ffffff"></path><path fill="#4fd79c" d="M317.637 56.851H194.37a50.9 50.9 0 0 0-32.93 12.057 50.789 50.789 0 0 0-5.893 23.79v26.2a12.251 12.251 0 0 0 12.253 12.253h9.161V107.98a17.429 17.429 0 0 1 12.38-16.658c.706-8.957 8.2-9.933 17.34-9.933h112.594a28.078 28.078 0 0 1 28.078 28.078v9.433a12.252 12.252 0 0 0 12.253 12.252h9.161V107.98a51.13 51.13 0 0 0-51.13-51.129z" opacity="1" data-original="#4fd79c" className=""></path></g></svg>
                    <span className="text">CLINIC</span>
                    {/* <button onClick={check}>กด</button> */}
                </a>
                <ul className="side-menu top">
                    {role=='A' &&(
                        <>
                        <li className={activeMenu === 'Dashboard' ? 'active' : ''} onClick={() => handleMenuClick('Dashboard')}>
                        <Link to="/dashboard">
                            <i className="fa-solid fa-chart-line"></i>
                            <div className="text">Dashboard</div>
                        </Link>
                        </li>
                        <li className={activeMenu === 'ManageUser' ? 'active' : ''} onClick={() => handleMenuClick('ManageUser')}>
                            <Link to="/manageuser">
                                <i className="fa-solid fa-user-pen"></i>
                                <span className="text">Manage User</span>
                            </Link>
                        </li>
                        </>
                    )}
                    {role=='N' &&(
                        <>
                        <li className={activeMenu === 'Question' ? 'active' : ''} onClick={() => handleMenuClick('Question')}>
                        <Link to="/Question">
                            <i className="fa-solid fa-list-ul"></i>
                            <div className="text">Question</div>
                        </Link>
                        </li>
                        </>
                    )}
                    {role=='P' &&(
                        <>
                        <li className={activeMenu === 'Medical Histories' ? 'active' : ''} onClick={() => handleMenuClick('Medical Histories')}>
                        <Link to="/medicalHistory">
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            <div className="text">Medical Histories</div>
                        </Link>
                        </li>
                        <li className={activeMenu === 'Personal Info' ? 'active' : ''} onClick={() => handleMenuClick('Personal Info')}>
                        <Link to="/Personalinfo">
                            <i className="fa-regular fa-address-card"></i>
                            <div className="text">Personal Info</div>
                        </Link>
                        </li>
                        </>
                    )}
                </ul>
                <ul className="side-menu down">
                    <li>
                        <a href="/" onClick={() => logout()}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span className="text">Logout</span>
                        </a>
                    </li>
                </ul>
            </section>

            <section className="header">
                <nav>
                    <i className="fa-solid fa-bars" onClick={toggleSidebar}></i>
                    <a href="#" className="profile">
                        <img src={acc_id && (import.meta.env.VITE_API+`/UserProfile/acc_profile/${acc_id}.png`)} alt="" />
                    </a>
                </nav>
            </section>
        </div>
    )
}

export default Sidebar