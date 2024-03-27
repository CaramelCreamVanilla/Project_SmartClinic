import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/authContext';
import MUIDataTable from "mui-datatables";
import '../Admin/manageuser.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSidebar } from '../Sidebar/sidebarcontext';
import Addquestionmodal from './Comp/addquestionmodal';
import Updatequestionmodal from './Comp/updatequestionmodal';

function Question() {
    const [question,setQuestion] = useState([{}])
    const [questionTransfrom,setQuestionTransfrom] = useState([])
    const [responsive, setResponsive] = useState('standard');
    const [selectQuestionUpdate,setSelectQuestionUpdate] = useState()

    const [agian,setAgian] = useState(false)
    const [selectedType, setSelectedType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { isSidebarOpen } = useSidebar();
    const mainClass = `Main${isSidebarOpen ? ' sidebarOpen' : ''}`;
    const [isModalOpenAddQuestion, setIsModalOpenAddQuestion] = useState(false);
    const [isModalOpenUpdateQuestion, setIsModalUpdateQuestion] = useState(false);
    
    const openModalAddQuestion = () => setIsModalOpenAddQuestion(true);
    const closeModalAddQuestion = () => setIsModalOpenAddQuestion(false);
    const openModalUpdateQuestion = (questionmodalselect) => {
        setIsModalUpdateQuestion(true);
        setSelectQuestionUpdate(questionmodalselect)
    }
    const closeModalUpdateUser = () => setIsModalUpdateQuestion(false);

    const columns = [
        { name: 'Question', label: 'Question', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Type', label: 'Type', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Answer', label: 'Answer', options: {
            sort: false, // Disables sorting for this column
          },},
        { name: 'Action', label: 'Action', options: {
            sort: false, // Disables sorting for this column
          },},
    ];

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

    useEffect(()=>{
        const getQuestion = async () =>{
            try{
                const res_question = await axios.get(import.meta.env.VITE_API + '/question/getQuestion')
                // console.log(res_question.data)
                setQuestion(res_question.data)
                
            }catch(error){
                console.log(error)
            }
            setAgian(false)
        }

        getQuestion()
    },[,agian,selectedType])

    useEffect(()=>{
        const transformData = (Data) => Data.map(item =>{
            return[
            <div className='imgintable'>
                <div className='profiletext'>
                    <h3>{item.question}</h3>
                </div>
            </div>
            , JSON.parse(item.answer).type 
            , JSON.parse(item.answer).type ==='OnlyVoice' ? '-' : JSON.stringify(JSON.parse(item.answer).answers), 
            <div className="iconintable">
                <i className="fa-solid fa-pen-to-square" onClick={()=>openModalUpdateQuestion(item)}></i>
                <i className="fa-solid fa-trash-can" onClick={() => suretodelete(item.q_id)}></i>
            </div>
            ]
        })

        const filteredData = question.filter(item => 
            (selectedType === 'All' || JSON.parse(item.answer).type === selectedType) &&
            ((item.question && item.question.toLowerCase().includes(searchQuery.toLowerCase())))
        );

        setQuestionTransfrom(transformData(filteredData))
    } ,[searchQuery,selectedType,question])

    const handleTypeChange = (e) =>{
        if(e.target.value === 'OnlyVoice'){
            setSelectedType('OnlyVoice')
        }else if(e.target.value === 'Choice'){
            setSelectedType('Choice')
        }else if(e.target.value === 'YesNo'){
            setSelectedType('YesNo')
        }else{
            setSelectedType('All')
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const suretodelete = (q_id) => {
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
                handleDeleteQuestion(q_id).then((isSuccess) => {
                    if (isSuccess) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your question has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Failed!",
                            text: "Your question could not be deleted.",
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

    const handleDeleteQuestion = async (q_id) =>{
        try{
            console.log(q_id)
            const res = await axios.delete(`${import.meta.env.VITE_API}/question/delete_question/${q_id}`)
            setAgian(true)
            if(res.status === 204){
                return true
            }
        }catch(error){
            console.error('Error deleting account:', error);
            return false
        }
    }

  return (
    <div className={mainClass}>
        <div className="main-content">
            <div className="head-title">
                <div className="left">
                    <h1>Question</h1>
                    <ul className="breadcrumb">
                        <li>
                            <a href="#">Home</a>
                        </li>
                        <li><i className="fa-solid fa-angle-right"></i></li>
                        <li>
                            <a className="active" href="#">Question</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="functable">
            <div className="btnadduser">
                <input type="submit" value="+ New Question" onClick={openModalAddQuestion}/>
            </div>

            <div className="searchboxandropdown">
                    <div className="searchbox">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input className="search-input" type="search" placeholder="Search..." onChange={handleSearchChange}/>
                    </div>
                    <div className="dropdown">
                        <label htmlFor="Type">Type : </label>
                        <select name="type" id="type" onChange={handleTypeChange}>
                            <option value="All">All</option>
                            <option value="OnlyVoice">Only Voice</option>
                            <option value="Choice">Choice</option>
                            <option value="YesNo">Yes/No</option>
                            {/* <option value="Admin">Admin</option> */}
                        </select>
                    </div>
            </div>
        </div>
    
        <div className="my-table" style={{ marginTop: "30px" }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden' }}>
                <MUIDataTable
                    data={questionTransfrom}
                    columns={columns}
                    options={options}
                />
            </div>
        </div>

        {isModalOpenAddQuestion && <Addquestionmodal onClose={closeModalAddQuestion} />}
        {isModalOpenUpdateQuestion && <Updatequestionmodal onClose={closeModalUpdateUser} questionData={selectQuestionUpdate}/>}

    </div>
  )
}

export default Question