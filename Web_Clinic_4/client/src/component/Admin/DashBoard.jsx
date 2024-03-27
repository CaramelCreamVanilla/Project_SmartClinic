import React, { useState , useEffect} from 'react';
import { useSidebar } from '../Sidebar/sidebarcontext';
import './dashboard.css'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';


ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
)


function Dashboard() {
    const [patient,setPatient] = useState([{}])
    const [personnel,setPersonnel] = useState([{}])
    const [Case,setCase] = useState([{}])
    const [dataPlotGraph,setDataPlotGraph] = useState([])
    const { isSidebarOpen } = useSidebar();
    const mainClass = `Main${isSidebarOpen ? ' sidebarOpen' : ''}`;

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun","July","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            label: "Total case of 2024",
            data: dataPlotGraph,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          }
        ]
      };
    const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    if (value % 1 === 0) {
                        return value;
                    }
                }
            }
        }
    },
    plugins: {
        legend: {
            display: true,
        }
    },
};
    

    useEffect(()=>{
        const getUser = async () =>{
            try{
                const res_user = await axios.get(import.meta.env.VITE_API+'/patient/getUser')
                const res_case = await axios.get(import.meta.env.VITE_API+'/patient/getCase')
                setPersonnel(res_user.data.filter(item => item.role_id === 'N' || item.role_id === 'A'))
                setPatient(res_user.data.filter(item => item.role_id === 'P'))
                setCase(res_case.data)
                countCaseEachMonth(res_case.data)
            }catch(error){
                console.log(error)
            }
        }

        const countCaseEachMonth = async (totalCase) =>{
            const monthCounts = new Array(12).fill(0);
    
            totalCase.forEach(item => {
                const date = new Date(item.date); // แปลง string เป็น Date object
                const month = date.getMonth(); // ได้เดือนจาก Date object (มกราคม = 0, กุมภาพันธ์ = 1, ..., ธันวาคม = 11)
                monthCounts[month]++; // เพิ่มค่านับสำหรับเดือนนั้น
            });
            setDataPlotGraph(monthCounts)
        }
        
        getUser();
    },[])

    return (
        <>
        <div className={mainClass}>
            <div className="main-content">
                <div className="head-title">
                    <div className="left">
                        <h1>Dashboard</h1>
                        <ul className="breadcrumb">
                            <li>
                                <a href="">Home</a>
                            </li>
                            <li><i className="fa-solid fa-angle-right"></i></li>
                            <li>
                                <a className="active" href="#">Dashboard</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ul className="box-info">
                <li>
                <i className="fa-solid fa-hospital-user"></i>
                    <span className="text">
                        <h3>{patient.length}</h3>
                        <p>Total Patients</p>
                    </span>
                </li>
                <li>
                <i className="fa-solid fa-user-nurse"></i>
                    <span className="text">
                        <h3>{personnel.length}</h3>
                        <p>Total Personnel</p>
                    </span>
                </li>
                <li>
                <i className="fa-solid fa-stethoscope"></i>
                    <span className="text">
                        <h3>{Case.length}</h3>
                        <p>Total Case</p>
                    </span>
                </li>
            </ul>

            <div className="graph-data">
                <div className="graph-topic">
                    <h3>Graph</h3>
                    <h5>Test</h5>
                </div>
                <div className="chart">
                    <Line data={data} options={options}></Line>
                </div>
            </div>
        </div>
    </>
    )
}

export default Dashboard