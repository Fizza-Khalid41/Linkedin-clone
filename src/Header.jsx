import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import HeaderOption from "./HeaderOption";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch } from "react-redux";
import { logout } from "./features/userSlice";

function Header({ onViewProfile, onGoHome, onNetwork, onJobs, onMessaging , onNotification }) {
  const dispatch = useDispatch();

  const logoutOfApp = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
  };

  return (
    <div className="header">
      <div className="header__left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
          alt=""
          onClick={onGoHome}
          style={{ cursor: "pointer" }}
        />
        <div className="header__search">
          <SearchIcon />
          <input type="text" />
        </div>
      </div>

      <div className="header__right">
        <HeaderOption Icon={HomeIcon} title="Home" onClick={onGoHome} />
        <HeaderOption Icon={SupervisorAccountIcon} title="My Network" onClick={onNetwork} />
        <HeaderOption Icon={BusinessCenterIcon} title="Jobs"  onClick={onJobs}/>
        <HeaderOption Icon={ChatIcon} title="Messaging" onClick={onMessaging} />
        <HeaderOption Icon={NotificationsIcon} title="Notifications" onClick={onNotification} />
        <HeaderOption
          avatar={true}
          title="Me"
          onLogout={logoutOfApp}
          onViewProfile={onViewProfile}
        />
      </div>
    </div>
  );
}

export default Header;