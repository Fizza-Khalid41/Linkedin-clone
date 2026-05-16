import { useState, useEffect} from "react";
import axios from "axios";
import "./Message.css"

function Messaging(){

    const[conversations, setConversation ] = useState([])
    const[selected, setSelected] = useState(null)

    useEffect ( ()=>{
          axios.get("http://127.0.0.1:8000/api/conversations/")
          .then( (res) => setConversations(res.data))
          .catch((err) => console.error("API error:", err));
        },[]);

    return(
        <div className="messaging">
            <section className="conversations">
                <div className="conv-header">
                    <h2>Messaging</h2>
                    <input placeholder="Search messages"/>
                </div>

                <div className="filters">
                    <button className="filter active">Focused ▾</button>
                    <button className="filter">Jobs</button>
                    <button className="filter">Unread</button>
                    <button className="filter">Connections</button>
                    <button className="filter">InMail</button>
                    <button className="filter">Starred</button>

                </div>

                <ul className="conv-list">
                    {conversations.map((c) => (
                        <li key={c.id}
                           className={`conv-item ${selected?.id === c.id ? "selected" : ""}`}
                           onClick={()=> setSelected(c)}>
                            <div className="avatar">
                                {c.avatar ? <img src={c.avatar} alt={c.name} /> : c.name[0]}
                            </div>
                            <div className="conv-text">
                                <div className="conv-top">
                                    <strong>{c.name}</strong>
                                    <span className="date">{c.date}</span>
                               </div>
                               <p>{c.last_message}</p>
                               </div>
                        </li>
                    )) }
                    {conversations.length}

                </ul>

            </section>

        </div>
    )  
}

export default Messaging;