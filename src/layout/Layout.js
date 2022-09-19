import React, { useState, useEffect } from "react";
import Navbar from "./../components/Navbar";
import { useNavigate } from "react-router-dom";
import UserData from "./../components/UserData";
import Footer from "../components/Footer";

export default function Layout(props) {
  let navigate = useNavigate();
  let __init_session = {
    access_token: "",
    personal: {
      id: "",
      name: "",
      email: "",
      username: "",
      role: "",
      first_name: "",
      last_name: "",
      signedUpAt: "",
    },
    isLoggedIn: false,
  };
  const [session, setSession] = useState(__init_session);
  useEffect(() => {
    let sessionData = JSON.parse(localStorage.getItem("loggedin"));
    if (sessionData) {
      setSession({
        access_token: "",
        personal: sessionData.data,
        isLoggedIn: true,
      });
    }
  }, []);
  const value = { session, setSession };
  return (
    <UserData.Provider value={value}>
      <div className="__Layout">
        <Navbar
          isLoggedIn={session.isLoggedIn}
          __init_session={__init_session}
          setSession={setSession}
          role={session.personal?.role}
          username={session.personal?.username}
        />
        {props.children}
      </div>
      <Footer />
    </UserData.Provider>
  );
}
