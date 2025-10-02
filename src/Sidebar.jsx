import React from "react"
import "./Sidebar.css"
import { Avatar } from "@mui/material"
import BookmarkIcon from "@mui/icons-material/Bookmark";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import EventIcon from "@mui/icons-material/Event";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";

function Sidebar() {

const user = useSelector(selectUser)

  return (
    <div className="sidebar">
     <div className="sidebar__top">
      <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt=""/>
      
      <Avatar className="sidebar__avatar"/>
      
      <div className="sidebar__info">
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
       <p>Lahore, Punjab</p>
     </div>
</div>
     <div className="sidebar__stats">
     <div className="sidebar__stat">
     <p>Profile viewers</p>
     <p className="sidebar__statNumber">2,543</p>
     </div>
     <div className="sidebar__stat">
     <p>Post impressions</p>
     <p className="sidebar__statNumber">1,200</p>
     </div>
    </div>
    <div className="sidebar__bottom">
        <div className="sidebar__link">
          <BookmarkIcon fontSize="small" />
          <p>Saved Items</p>
        </div>
        <div className="sidebar__link">
          <GroupIcon fontSize="small" />
          <p>Groups</p>
        </div>
        <div className="sidebar__link">
          <ArticleIcon fontSize="small" />
          <p>Newsletters</p>
        </div>
        <div className="sidebar__link">
          <EventIcon fontSize="small" />
          <p>Events</p>
        </div>
    </div>

    </div>
  )
}

export default Sidebar;