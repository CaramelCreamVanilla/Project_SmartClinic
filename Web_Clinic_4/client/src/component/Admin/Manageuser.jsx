import React, { useState , useEffect } from 'react';
import { useSidebar } from '../Sidebar/sidebarcontext';
import MUIDataTable from "mui-datatables";
import './manageuser.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import Addusermodal from './comp/addusermodal';
import Viewusermodal from './comp/viewusermodal';
import Updateusermodal from './comp/updateusermodal';

function Manageuser() {
    const [user,setuser] = useState([{}])
    const [selectUserViewModal,setSelectUserViewModal] = useState(null)
    const [selectUserUpdate,setSelectUserUpdate] = useState(null)
    const [userTransfromed,setUserTransfromed] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [agian,setAgian] = useState(false)


    const [isModalOpenAddUser, setIsModalOpenAddUser] = useState(false);
    const [isModalOpenUpdateUser, setIsModalUpdateUser] = useState(false);
    const [isModalOpenViewUser, setIsModalViewUser] = useState(false);

    const openModalAddUser = () => setIsModalOpenAddUser(true);
    const closeModalAddUser = () => setIsModalOpenAddUser(false);
    const openModalUpdateUser = (usermodalselect) => {
        setIsModalUpdateUser(true);
        setSelectUserUpdate(usermodalselect)
    }
    const closeModalUpdateUser = () => setIsModalUpdateUser(false);
    const openModelViewUser = (usermodalselect) => {
        setIsModalViewUser(true);
        setSelectUserViewModal(usermodalselect)
    }
    const closeModalViewUser = () => setIsModalViewUser(false);

    useEffect(() => {
        if (isModalOpenAddUser || isModalOpenUpdateUser || isModalOpenViewUser) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflowY = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflowY = 'auto';
        }
    }, [isModalOpenAddUser,isModalOpenUpdateUser,isModalOpenViewUser]);

    useEffect(()=>{
        const getUser = async () =>{
            try{
                const res_user = await axios.get(import.meta.env.VITE_API+'/patient/getUser')
                setuser(res_user.data.filter(item => item.role_id === 'N' || item.role_id === 'P'))
            }catch(error){
                console.log(error)
            }
            setAgian(false)
        }

        getUser();
    },[,agian,selectedRole])

    useEffect(()=>{
        const transformData = (Data) => Data.map(item =>{
            return[
            <div className='imgintable'>
                <img src={import.meta.env.VITE_API+`/UserProfile/acc_profile/${item.account_id}.png`} alt="" />
                <div className='profiletext'>
                    <p>{item.name}</p><p>{item.phoneNumber}</p>
                </div>
            </div>, item.p_id ? item.p_id : "-", 
            <div className={`sexintable ${item.gender === 'M' ? 'male' : 'female'}`}>
                {item.gender == 'M'? 'Male':'Female'}
            </div>, item.role_id == 'P' ? 'Patient':'Nurse', 
            <div className="iconintable">
                <i className="fa-solid fa-id-card-clip" onClick={() => openModelViewUser(item)}></i>
                <i className="fa-solid fa-pen-to-square" onClick={()=>openModalUpdateUser(item)}></i>
                <i className="fa-solid fa-trash-can" onClick={() => suretodelete(item.account_id)}></i>
            </div>
            ]
        })

        const filteredData = user.filter(item => 
            (selectedRole === 'All' || item.role_id === selectedRole) &&
            ((item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.p_id && item.p_id.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setUserTransfromed(transformData(filteredData));

    } ,[selectedRole, user, searchQuery])

    const handleRoleChange = (event) => {
        if(event.target.value == 'Patient'){
            setSelectedRole('P')
        }else if(event.target.value == 'Nurse'){
            setSelectedRole('N')
        }else{
            setSelectedRole('All')
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const columns = [
        { name: 'Profile', label: 'Profile', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'CardID', label: 'CardID', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Sex', label: 'Sex', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Role', label: 'Role', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Action', label: 'Action', options: {
            sort: false, // Disables sorting for this column
          },},
    ];

    const handleDeleteAcc = async (acc) =>{
        try{
            const res = await axios.delete(`${import.meta.env.VITE_API}/patient/delete_acc/${acc}`)
            setAgian(true)
            if(res.status === 204){
                return true
            }
        }catch(error){
            console.error('Error deleting account:', error);
            return false
        }
    }

    const suretodelete = (acc) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteAcc(acc).then((isSuccess) => {
                    if (isSuccess) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your account has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Failed!",
                            text: "Your account could not be deleted.",
                            icon: "error"
                        });
                    }
                }).catch((error) => {
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong: " + error,
                        icon: "error"
                    });
                });
            }
        });
    }

    const [responsive, setResponsive] = useState('standard');

    
    const { isSidebarOpen } = useSidebar();
    const mainClass = `Main${isSidebarOpen ? ' sidebarOpen' : ''}`;

    const options = {
        selectableRows: 'none',
        elevation: 0,
        responsive,
        search: false,
        download: false,
        print: false,
        viewColumns: false,
        filter: false,
        textTransform: 'none',
        pagination: true, // Enable pagination
        rowsPerPage: 5, // Set number of rows per page
        rowsPerPageOptions: [5, 10, 15],
    };

    const check = () =>{
        console.log(userTransfromed)
    }
    
    return (
        <>
            <div className={mainClass}>
                <div className="main-content">
                    <div className="head-title">
                        <div className="left">
                            <h1>Manage User</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="#">Home</a>
                                    {/* <button onClick={check}>ปุ่ม</button>  */}
                                </li>
                                <li><i className="fa-solid fa-angle-right"></i></li>
                                <li>
                                    <a className="active" href="#">Manage User</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="functable">
                    <div className="btnadduser">
                        <input type="submit" value="+ New User" onClick={openModalAddUser}/>
                    </div>
                    <div className="searchboxandropdown">
                        <div className="searchbox">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input className="search-input" type="search" placeholder="Search..." onChange={handleSearchChange}/>
                        </div>
                        <div className="dropdown">
                            <label htmlFor="role">Role : </label>
                            <select name="role" id="role" onChange={handleRoleChange}>
                                <option value="All">All</option>
                                <option value="Patient">Patient</option>
                                <option value="Nurse">Nurse</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="my-table" style={{ marginTop: "30px" }}>
                    <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <MUIDataTable
                            data={userTransfromed}
                            columns={columns}
                            options={options}
                        />
                    </div>
                </div>

                {isModalOpenAddUser && <Addusermodal onClose={closeModalAddUser} />}
                {isModalOpenUpdateUser && <Updateusermodal onClose={closeModalUpdateUser} userdata={selectUserUpdate}/>}
                {isModalOpenViewUser && <Viewusermodal onClose={closeModalViewUser} userdata={selectUserViewModal}/>}
                
            </div>
        </>
    )
}

export default Manageuser