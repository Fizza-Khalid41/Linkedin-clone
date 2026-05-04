import { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import  {selectUser } from "./features/userSlice"

function Jobs () {

   const user = useSelector(selectUser)
   const token = localStorage.getItem("token")

   const[jobs , setJobs] = useState([])

   useEffect (()=> {

    axios.get("http://127.0.0.1:8000/api/jobs/",{
        headers : {Authorization : `Bearer ${token}`}
    })

    .then(
        res => setJobs(res.data)
    )
    .catch(
        err => console.log(err)
    )

   },[])


   const dismissJob =(id)=>{
        setJobs(jobs.filter(job => job.id !== id))
   }

   return(
    <div className="jobs">
        <div className="jobs_left">
            <div className="jobs_profileCard">
                <div className="jobs_cover"></div>
                <Avatar className="jobs_avatar">{user?.displayName?.[0]}</Avatar>
                <h3>{user?.displayName}</h3>
                 <p>{user?.email}</p>
               </div>

               <div className="jobs_leftCard">
                <p>📋 Preferences</p>
                <p>🔖 Job tracker</p>
                <p>📝 Post a free job</p>
              </div>
               
        </div>

        <div className="jobs_right">
            <h2>Top job pick for you</h2>
            <p className="jobs_subtitle">
                 Based on your profile, preferences, and activity
            </p>
            {jobs.length === 0 ?(
                <p style={{color: "gray", textAlign: "center" , padding:"20px"}}>
                    No job available at a moment
                 </p>
            ):(
                jobs.map((job)=>(
                    <div key={job.id} className="jobs_card">
                        <Avatar className="jobs_companyAvatar">{job.company[0]}</Avatar>
                        <div className="jobs_cardInfo">
                            <h3 className="jobs_title">{job.title}</h3>
                            <p>{job.company} • {job.location} </p>
                             <p className="jobs__time">{job.job_type}</p>
                        </div>
                        <button className="jobs_dismiss" onClick={()=> dismissJob(job.id)}>
                             ✕
                        </button>
                    </div>
                ))
           ) }

        </div>


    </div>
   )
}

export default Jobs