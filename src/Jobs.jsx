import { useState, useEffect } from "react";
import axios from "axios";
import "./Jobs.css";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import  {selectUser } from "./features/userSlice"

function Job () {

   const user = useSelector(selectUser)
   const token = localStorage.getItem("token")

   const[jobs , setJobs] = useState([])

   useEffect (()=> {

    axios.get("http://127.0.0.1:8000/api/jobs/",{
        headers : {Authorization : `Bearer ${token}`}
    })

    .then(
        res => setJob(res.data)
    )
    .catch(
        err => console.log(err)
    )

   },[])


   const dismissJob =(id)=>{
        setJobs(jobs.filter(job => job.id !== id))
   }
}