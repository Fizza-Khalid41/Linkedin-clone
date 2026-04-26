import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import "./Network.css";

const[users, setUsers] = useState([])
const[connections, setConnections] = useState([])
const[pending, setPending] = useState([])

const token = localStorage.getItem("token");

useEffect (() =>{
    axios.get("http://127.0.0.1:8000/api/users/"), {
        headers :  {Authorization: `Bearer ${token}`}
    }

   .then(res => setUsers(res.data));

    axios.get("http://127.0.0.1:8000/api/connections/"), {
        headers :  {Authorization: `Bearer ${token}`}
    }

   .then(res => setConnections(res.data));

   axios.get("http://127.0.0.1:8000/api/connections/Pending/"), {
        headers :  {Authorization: `Bearer ${token}`}
    }

   .then(res => setPending(res.data));
   },[])

   const sendRequest = () =>{
        axios.post("http://127.0.0.1:8000/api/connections/send/${userId}/"),{},{
            headers : {Authorization: `Bearer ${token}`}

        }
        .then(()=>{
           setUsers(users.map(u =>
            u.id === userId ? {...u , status : "pending"} : u
        ));
    });
};


   const acceptRequest =(userId)=>{
       axios.post("http://127.0.0.1:8000/api/connections/accept/${userId}/", {}, {
       headers: { Authorization: `Bearer ${token}` }
    })
      .then(()=>{
        const accepted = pending.find(p => p.id === userId);
         setPending (pending.filter(p=> pid !== userId));
         setConnections([...connections, accepted]);
    });
};
    
