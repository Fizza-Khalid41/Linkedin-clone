import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import Login from "./Login";
import Widgets from "./Widgets";
import Profile from "./Profile";
import Network from "./Network"
import Jobs from "./Jobs"
import  Message  from "./Message";



function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const token     = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      dispatch(login(JSON.parse(savedUser)));
    } else {
      dispatch(logout());
    }
  }, []);

  
  const headerProps = {
    onViewProfile: () => setCurrentPage('profile'),
    onGoHome:      () => setCurrentPage('home'),
    onNetwork:      () => setCurrentPage('network'),
    onJobs: () => setCurrentPage('jobs'),
    onMessaging:() => setCurrentPage('message')
   
  };

 return (
  <div className="app">
    {!user ? (
      <Login />

    ) : currentPage === 'profile' ? (
      <>
        <Header {...headerProps} />
        <Profile onBack={() => setCurrentPage('home')} />
      </>
    ) : currentPage === 'network' ? (
      <>
      <Header {...headerProps} />
        <Network />
      </>
      ) : currentPage === 'jobs' ? (
      <>
      <Header {...headerProps} />
        <Jobs />
      </>
       ) : currentPage === 'message' ? (
      <>
      <Header {...headerProps} />
        <Message/>
      </>
    ):(
      <>
        <Header {...headerProps} />
        <div className="app__body">
          <Sidebar />
          <Feed />
          <Widgets />
        </div>
      </>
    )}
  </div>
);
}

export default App;