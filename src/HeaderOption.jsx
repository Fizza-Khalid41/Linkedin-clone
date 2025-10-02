import React, { useState } from "react"
import "./HeaderOption.css"
import { Avatar } from "@mui/material"
import { useSelector } from "react-redux"
import { selectUser } from "./features/userSlice"

function HeaderOption({ avatar, Icon, title, onLogout }) {
  const user = useSelector(selectUser)
  const [open, setOpen] = useState(false)

  return (
    <div className="headerOption">
      <div
        className="headerOption__main"
        onClick={() => setOpen(!open)} // ✅ avatar click -> dropdown toggle
      >
        {Icon && <Icon className="headerOption__icon" />}
        {avatar && (
          <Avatar className="headerOption__icon">
            {user?.email[0]}
          </Avatar>
        )}
        <h3 className="headerOption__title">{title}</h3>
      </div>

      {/* ✅ dropdown menu */}
      {open && (
        <div className="headerOption__menu">
          <p>View Profile</p>
          <p onClick={onLogout}>Sign Out</p>
        </div>
      )}
    </div>
  )
}

export default HeaderOption
