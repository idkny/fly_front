import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CONSTANT } from "../CONSTANT";
import { axiosInstance } from "../axiosApi";
import "./../scss/Navbar.scss";

const Navbar = (props) => {
  let navigate = useNavigate();
  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axiosInstance.defaults.headers["Authorization"] = null;
    localStorage.removeItem("loggedin");
    props.setSession(props.__init_session);
    navigate("/login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg __Navbar">
        <Link to="/" className="navbar-brand">
          <img className="logo py-1" src="/mainlogo.png" alt="navbar logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="icon">+</span>
        </button>
        <div className={`collapse navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {props.isLoggedIn ? (
              <li className="nav-item">
                <Link to="/" className="nav-link simple-nav-link active">
                <button className="Button-Custom-1 fill">
                  <span className="content">
                    <span className="type">Hi, {props.username}</span>
                  </span>
                </button>
              </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item">
              <Link to="/" className="nav-link simple-nav-link active">
                <button className="Button-Custom-1 white">
                  <span className="content">
                    <span className="type">Home</span>
                  </span>
                </button>
              </Link>
            </li>
          </ul>
          <div className="form-inline d-flex flex-row my-2 my-lg-0">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item signup">
                <Link to="/cart" className="Button-Custom-1 fill">
                  <span className="content">
                    <span className="type">Cart</span>
                  </span>
                </Link>
              </li>
              {!props.isLoggedIn ? (
                <>
                  <li className="nav-item signup">
                    <Link to="/login" className="Button-Custom-1 unfill">
                      <span className="content">
                        <span className="type">Log In</span>
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item signup">
                    <Link to="/register" className="Button-Custom-1 fill">
                      <span className="content">
                        <span className="type">Register</span>
                      </span>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {props.role === "user" ? (
                    <>
                      <li className="nav-item signup">
                        <Link
                          to="/myTickets"
                          className="Button-Custom-1 fill w-100"
                        >
                          <span className="content">
                            <span className="type">MyTickets</span>
                          </span>
                        </Link>
                      </li>
                    </>
                  ) : props.role === "airlineOwner" ? (
                    <li className="nav-item signup">
                      <Link
                        to="/myFlights"
                        className="Button-Custom-1 fill w-100"
                      >
                        <span className="content">
                          <span className="type">MyFlights</span>
                        </span>
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="nav-item signup">
                    <button className="Button-Custom-1 white" onClick={logout}>
                      <span className="content">
                        <span className="type">Logout</span>
                      </span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
