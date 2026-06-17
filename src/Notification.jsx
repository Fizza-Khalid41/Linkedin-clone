import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { Avatar } from "@mui/material";
import axios from "axios";
import "./Notification.css";

const API_BASE = "http://127.0.0.1:8000";

const tabs = [
  { id: "all",      label: "All"      },
  { id: "jobs",     label: "Jobs"     },
  { id: "my-posts", label: "My posts" },
  { id: "mentions", label: "Mentions" },
];


function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <div className="jobs_cover"></div>
      <Avatar
        className="jobs_avatar"
        style={{ width: 64, height: 64, fontSize: 26, background: "#0077b5" }}
      >
        {user?.displayName?.[0] || user?.name?.[0] || "U"}
      </Avatar>
      <div className="profile-info">
        <h3>{user?.displayName || user?.name || "User"}</h3>
        <p className="profile-headline">{user?.email || ""}</p>
      </div>
      <button className="experience-button">+ Experience</button>
    </div>
  );
}


function NotificationCard({ notification, onMarkRead }) {
  const message  = notification.message || notification.title || "New notification";
  const isUnread = !notification.is_read;
  const sender   = notification.sender;

  const senderName    = sender?.username || "?";
  const senderPic     = sender?.profile_picture || null;
  const senderInitial = senderName[0]?.toUpperCase() || "?";

  return (
    <div
      className={`notification-card ${isUnread ? "unread" : "read"}`}
      onClick={() => isUnread && onMarkRead(notification.id)}
    >
      {isUnread && <span className="unread-dot" />}

      
      <div className="notif-avatar-wrap">
        {senderPic ? (
          <img src={senderPic} alt={senderName} className="notif-sender-avatar" />
        ) : (
          <div className="notif-sender-avatar notif-sender-initial">
            {senderInitial}
          </div>
        )}
      </div>

      <div className="notification-content">
        <p className="notification-title">{message}</p>
        {notification.notif_type === "profile_view" && (
          <span className="premium-badge">⭐ Powered by Premium</span>
        )}
        <p className="notification-time">{notification.time_ago || ""}</p>
      </div>

      {notification.notif_type === "job_alert" && (
        <button className="notification-action" onClick={e => e.stopPropagation()}>
          View job
        </button>
      )}
      {notification.notif_type === "connection_request" && (
        <div className="connect-actions">
          <button className="btn-accept" onClick={e => e.stopPropagation()}>Accept</button>
          <button className="btn-ignore" onClick={e => e.stopPropagation()}>Ignore</button>
        </div>
      )}
    </div>
  );
}


function Notifications() {
  const user  = useSelector(selectUser);
  const token = localStorage.getItem("token");

  
  const authAxios = axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });

  const [notifications, setNotifications] = useState([]);
  const [activeTab,     setActiveTab]     = useState("all");
  const [loading,       setLoading]       = useState(true);

  
  useEffect(() => {
    setLoading(true);
    const filter = activeTab === "my-posts" ? "my_posts" : activeTab;

    authAxios
      .get(`/api/notifications/?filter=${filter}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Notifications error:", err))
      .finally(() => setLoading(false));

  }, [activeTab]);

  
  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    authAxios.post(`/api/notifications/${id}/mark-read/`).catch(console.error);
  };

  
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    authAxios.post("/api/notifications/mark-all-read/").catch(console.error);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        
        <div className="left-sidebar">
          <ProfileCard user={user} />
          <div className="manage-notifications">
            <h4>Manage your notifications</h4>
            <button className="view-settings-button">View settings</button>
          </div>
        </div>

       
        <div className="right-content">
          <div className="notifications-header">
            <div className="header-row">
              <span className="notif-title-text">
                Notifications
                {unreadCount > 0 && <span className="badge">{unreadCount} new</span>}
              </span>
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={markAllRead}>
                  Mark all as read
                </button>
              )}
            </div>

          
            <div className="notification-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          
          <div className="notifications-list">
            {loading ? (
              [1, 2, 3].map(i => (
                <div className="notification-card read" key={i}>
                  <div className="skel-icon" />
                  <div style={{ flex: 1 }}>
                    <div className="skel-line wide"  style={{ marginBottom: 8 }} />
                    <div className="skel-line short" />
                  </div>
                </div>
              ))
            ) : notifications.length === 0 ? (
              <p className="no-notifications">No notifications found.</p>
            ) : (
              notifications.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkRead={markRead}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Notifications;
