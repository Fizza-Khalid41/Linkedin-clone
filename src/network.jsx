import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import axios from "axios";
import "./Network.css";


function Network (){
const[users, setUsers] = useState([])
const[connections, setConnections] = useState([])
const[pending, setPending] = useState([])

const token = localStorage.getItem("token");

useEffect (() =>{
    axios.get("http://127.0.0.1:8000/api/users/", {
        headers :  {Authorization: `Bearer ${token}`}
    })
    .then(res => setUsers(res.data));

    axios.get("http://127.0.0.1:8000/api/connections/", {
        headers :  {Authorization: `Bearer ${token}`}
    })
    .then(res => setConnections(res.data));

   axios.get("http://127.0.0.1:8000/api/connections/pending/", {
        headers :  {Authorization: `Bearer ${token}`}
    })
    .then(res => setPending(res.data));
   },[])

   const sendRequest = (userId) => {
    axios.post(
        `http://127.0.0.1:8000/api/connections/send/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
        setUsers(users.map(u =>
            u.id === userId ? { ...u, status: "pending" } : u
        ));
    });
};

   const acceptRequest =(userId)=>{
       axios.post(`http://127.0.0.1:8000/api/connections/accept/${userId}/`, {}, {
       headers: { Authorization: `Bearer ${token}` }
    })
      .then(()=>{
        const accepted = pending.find(p => p.id === userId);
         setPending (pending.filter(p=> p.id !== userId));
         
        setUsers(users.filter(u => u.id !== userId));


    });
};

const rejectRequest =(userId)=>{
    axios.post(`http://127.0.0.1:8000/api/connections/reject/${userId}/`, {},{
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(()=>{
         setPending(pending.filter(p => p.id !== userId));
    });
};

const dismissUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
};


return(
    <div className="network">
        <div className="network_left">
            <div className="network_card">
                <h3>Manage my network</h3>
                <div className="network_leftItem">
                    <span>👥 Connections</span>
                    <span className="network_count">{connections.length}</span>
                </div>
                <div className="network_leftItem">
                    <span>👤 Following & followers</span>
                </div>
                <div className="network_leftItem">
                    <span>👥 Groups</span>
                </div>
                <div className="network_leftItem">
                    <span>📅 Events</span>
                </div>
                <div className="network_leftItem">
                    <span>📄 Newsletters</span>
                </div>
            </div>
    </div>

    <div className="network_right">
        {pending.length > 0 && (
            <div className="network_card">
                <h3>Invitations ({pending.length})</h3>
                {pending.map(user => (
                   <div key={user.id} className="network_userRow">
                    <Avatar className="network_avatar">{user.name[0]}</Avatar>
                    <div className="network_userInfo">
                       <h4> {user.name}</h4>
                        <p>{user.email}</p>
                    </div>
                    <div className="network_actions">
                    <button className="network_ignoreBtn" onClick={()=>rejectRequest(user.id)}>
                        Ignore
                    </button>
                    <button className="network_acceptBtn" onClick={()=>acceptRequest(user.id)}>
                        Accept
                    </button>
                    
                    </div>
        </div>
    ) )}

</div>
)}

            

            <div className="network_card">
                <div className="network_cardHeader">
                    <h3>People You May Know</h3>
                    <span className="network_showAll">Show all</span>
                </div>
                <div className="network_grid">
                    {users
              .filter(u => u.status === 'none' || u.status === 'pending')
              .map(user => (
                <div key={user.id} className="network_gridCard">
                 
                  <button
                    className="network_dismissBtn"
                    onClick={() => dismissUser(user.id)}
                  >
                    ✕
                  </button>

                 
                  <div className="network_gridAvatarWrap">
                    <Avatar className="network_gridAvatar">
                      {user.name[0]}
                    </Avatar>
                  </div>

                  
                  <div className="network_gridInfo">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                  
                 
                  {user.status === 'pending' ? (
                    <button className="network_gridPendingBtn" disabled>
                      ⏳ Pending
                    </button>
                  ) : (
                    <button
                      className="network_gridConnectBtn" onClick={() => sendRequest(user.id)} >
                      + Connect
                    </button>
                  )}

             </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Network;
   
