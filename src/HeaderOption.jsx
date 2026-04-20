import React, { useState } from "react";
import "./HeaderOption.css";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";

function HeaderOption({ avatar, Icon, title, onLogout, onViewProfile, onClick }) {
  const user = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  return (
    <div className="headerOption">
      <div
        className="headerOption__main"
        onClick={() => {
          if (onClick) onClick();
          else setOpen(!open);
        }}
      >
        {Icon && <Icon className="headerOption__icon" />}
        {avatar && (
          <Avatar className="headerOption__icon">
            {user?.email[0]}
          </Avatar>
        )}
        <h3 className="headerOption__title">{title}</h3>
      </div>

      {open && avatar && (
        <div className="headerOption__menu">
          <p onClick={() => { onViewProfile(); setOpen(false); }}>
            View Profile
          </p>
          <p onClick={onLogout}>Sign Out</p>
        </div>
      )}
    </div>
  );
}

export default HeaderOption;