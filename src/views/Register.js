import React, { useState, useEffect } from "react";
import "./../scss/Auth.scss";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axiosApi";
import { useNavigate } from "react-router-dom";
import { checkLoginFromLogin, setMessage, resetMessage } from "./../CONSTANT";

function Register(props) {
  let navigate = useNavigate();

  useEffect(() => {
    if (checkLoginFromLogin()) {
      navigate("/");
    }
  }, []);

  const __init = {
    username: "",
    email: "",
    password: "",
    role: "user",
  };
  const [credentials, setCredentials] = useState(__init);
  const changeCredentials = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const regsiter = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      credentials.email !== "" &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(credentials.email)
    ) {
      if (
        credentials.password !== "" &&
        credentials.username !== "" &&
        credentials.role !== ""
      ) {
        await axiosInstance
          .post("auth/users", {
            ...credentials,
          })
          .then((responce) => {
            if (responce.status === 200) {
              let res = responce.data;
              if (res.message) {
                let message = "";
                if (res.message.email) {
                  message += "Email : ";
                  message +=
                    res.message.email.map((a, b) => {
                      return a + " ";
                    }) + "<br/>";
                }
                if (res.message.username) {
                  message += "Username : ";
                  message +=
                    res.message.username.map((a, b) => {
                      return a + " ";
                    }) + "<br/>";
                }
                if (res.message.password) {
                  message += "Password : ";
                  message +=
                    res.message.password.map((a, b) => {
                      return a + " ";
                    }) + "<br/>";
                }
                setMessage(message, "danger");
              } else {
                axiosInstance
                  .post("auth/token/obtain", {
                    username: credentials.username,
                    password: credentials.password,
                  })
                  .then((response) => {
                    if (response.data) {
                      axiosInstance.defaults.headers["Authorization"] =
                        "JWT " + response.data.access;
                      localStorage.setItem(
                        "access_token",
                        response.data.access
                      );
                      localStorage.setItem(
                        "refresh_token",
                        response.data.refresh
                      );
                      localStorage.setItem(
                        "loggedin",
                        JSON.stringify({
                          data: {
                            id: response.data.id,
                            name: response.data.name,
                            email: response.data.email,
                            username: response.data.username,
                            first_name: response.data.first_name,
                            last_name: response.data.last_name,
                            role: response.data.role,
                            signedUpAt: response.data.signedUpAt,
                          },
                        })
                      );
                      navigate("/");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setMessage("Fill All Fields", "danger");
      }
    } else {
      setMessage("Please Enter Valid Email", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Register";
  };

  return (
    <>
      <div className="row A__Login" style={{ margin: "0px", padding: "0px" }}>
        <div className="col-lg-6 d-none d-lg-flex flex-column background-custom d-flex justify-content-center align-items-center">
          <img
            src="/register.svg"
            className="img-fluid mb-3"
            alt="Register illustration"
          />
          <h1>Welcome!</h1>
          <p>Get started by signing up!</p>
        </div>
        <div className="col-lg-6 col-sm-12 d-flex justify-content-center align-items-center">
          <div className="form d-flex flex-column justify-content-center align-items-center">
            <h1 className="mb-5">Register</h1>
            <div>
              <div className="custom-input input-group mb-3">
                <select
                  className="form-select form-control"
                  name="role"
                  onChange={changeCredentials}
                  value={credentials.role}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      regsiter(e);
                    }
                  }}
                >
                  <option selected value={"user"}>
                    User
                  </option>
                  <option value="airlineOwner">Airline Owner</option>
                </select>
              </div>
              <div className="custom-input input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  onChange={changeCredentials}
                  value={credentials.email}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      regsiter(e);
                    }
                  }}
                />
              </div>
              <div className="custom-input input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  name="username"
                  onChange={changeCredentials}
                  value={credentials.username}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      regsiter(e);
                    }
                  }}
                />
              </div>
              <div className="custom-input input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={changeCredentials}
                  value={credentials.password}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value !== "") {
                      regsiter(e);
                    }
                  }}
                />
              </div>
              <p
                className="text-danger p-0 m-0 mb-2"
                id="error"
                style={{ display: "none" }}
              >
                Error
              </p>
              <div className="w-100 mt-1 custom-button">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    padding: "12px 15px",
                  }}
                  onClick={regsiter}
                >
                  Register
                </button>
              </div>
              <div className="mt-5 d-flex justify-content-center align-items-center">
                <Link to="/">← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
