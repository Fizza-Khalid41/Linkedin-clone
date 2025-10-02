import React, { useEffect } from "react"
import "./App.css"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Feed from "./Feed"
import { useDispatch, useSelector } from "react-redux"
import { login, logout, selectUser } from "./features/userSlice"
import Login from "./Login"
import { auth } from "./firebase"
import Widgets from "./Widgets"


function App() {
  const user =useSelector(selectUser)
  const dispatch =useDispatch ();

   useEffect(()=>{
    auth.onAuthStateChanged(userAuth =>{
      if(userAuth){
             // user is logged in 
             dispatch(login({
                email : userAuth.email,
                uid: userAuth.uid,
                displayName : userAuth.displayName,

             })
            )
      }else{
             // user is logged out
             dispatch(logout())
      }

    })
 },[])

return (
  <div className="app">
    {!user ? (
      // ✅ user logout hone par sirf Login page dikhega
      <Login />
    ) : (
      <>
        {/* ✅ user login hone par Header aur baaki components dikhenge */}
        <Header />
        <div className="app__body">
          <Sidebar />
          <Feed />
          <Widgets/>
        </div>
      </>
    )}
  </div>
);
}

export default App
