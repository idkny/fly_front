import React, { useState, useEffect, useContext } from "react";
import "./../scss/MyFlights.scss";
import { useNavigate } from "react-router-dom";
import UserData from "./../components/UserData";
import { axiosInstance } from "../axiosApi";
import {
  checkLoginFromNonLoginAirline,
  setMessage,
  resetMessage,
} from "../CONSTANT";

export default function MyFlights() {
  let navigate = useNavigate();
  const { session, setSession } = useContext(UserData);
  useEffect(() => {
    if (checkLoginFromNonLoginAirline()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (session.personal?.id !== "") {
      fetchAirline();
      fetchCountries();
    }
  }, [session]);

  const __init_airline = {
    name: "",
    country: "",
  };

  const __init_flight = {
    airline_company: "",
    origin_contry: "",
    destination_contry: "",
    landing_time: "",
    departure_time: "",
    remaining_tickets: "",
    price: "",
  };

  const [airline, setAirline] = useState(null);
  const [flights, setFlights] = useState([]);
  const [countries, setCountries] = useState([]);
  const [data, setData] = useState(null);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAirline = async () => {
    await axiosInstance
      .get(`api/airlines/${session.personal?.id}`)
      .then((response) => {
        if (response.data.length > 0) {
          setAirline(response.data[0]);
          fetchFlights(response.data[0]["id"]);
          setData(__init_flight);
        } else {
          setData(__init_airline);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchFlights = async (airline_company = undefined) => {
    await axiosInstance
      .get(`api/flights/${airline_company ?? airline.id}`)
      .then((response) => {
        if (response.data.length > 0) {
          setFlights(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCountries = async () => {
    await axiosInstance
      .get(`api/countries`)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addAirline = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (data.name !== "" && data.country !== "") {
      await axiosInstance
        .post("api/airlines", {
          ...data,
          user: session.personal?.id,
        })
        .then((response) => {
          if (response.data.message) {
            setMessage(response.data.message, "danger");
          } else {
            fetchAirline();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setMessage("Please fill all inputs!", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Add";
  };

  const addFlight = async (e) => {
    e.target.style.pointerEvents = "none";
    e.target.innerHTML =
      '<div className="spinner-border custom-spin" role="status"><span className="visually-hidden">Loading...</span></div>';
    e.preventDefault();
    resetMessage();
    if (
      data.destination_contry !== "" &&
      data.origin_contry !== "" &&
      data.landing_time !== "" &&
      data.departure_time !== "" &&
      data.remaining_tickets !== "" &&
      data.price !== ""
    ) {
      if (
        new Date(data.departure_time) > new Date() &&
        new Date(data.landing_time) > new Date()
      ) {
        if (new Date(data.departure_time) < new Date(data.landing_time)) {
          if (
            parseInt(data.remaining_tickets) >= 1 &&
            parseInt(data.price) >= 1
          ) {
            await axiosInstance
              .post("api/flights", {
                ...data,
                airline_company: airline.id,
              })
              .then((response) => {
                if (response.data.message) {
                  setMessage(response.data.message, "danger");
                } else {
                  setMessage("Flight Added!", "success");
                  setData(__init_flight);
                  fetchFlights();
                }
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            setMessage("Tickets or price should be greater than zero!", "danger");
          }
        } else {
          setMessage(
            "Departure time should be less than landing time!",
            "danger"
          );
        }
      } else {
        setMessage(
          "Departure and landing time should be in future time!",
          "danger"
        );
      }
    } else {
      setMessage("Please fill all inputs!", "danger");
    }
    e.target.style.pointerEvents = "unset";
    e.target.innerHTML = "Add";
  };

  return (
    <div className="fit-with-navbar __MyFlights">
      <span className="display-5">
        Welcome <b className="text-success">{session.personal?.username}</b>!
      </span>
      {data && !airline ? (
        <div className="my-2 row w-100">
          <span className="text-danger">
            Seems like you've not setup your Airline details! Kindly fill this!
          </span>
          <div className="my-3"></div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="custom-input input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Airline Name"
                  name="name"
                  onChange={changeData}
                  value={data.name}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="custom-input input-group mb-3">
                <select
                  className="form-select form-control"
                  name="country"
                  onChange={changeData}
                  value={data.country}
                >
                  <option disabled selected value={""}>
                    Select Country
                  </option>
                  {countries.map((country, index) => {
                    return (
                      <option value={country.id} key={index}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div className="w-100 mt-1 custom-button">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    padding: "12px 15px",
                  }}
                  onClick={addAirline}
                >
                  Add Airline
                </button>
              </div>
            </div>
            <p
              className="text-danger p-0 m-0 mb-2"
              id="error"
              style={{ display: "none" }}
            >
              Error
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
      {data && airline ? (
        <>
          <div className="my-2 row w-100 mt-5">
            <span className="display-5">New Flight</span>
            <div className="my-3"></div>

            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <select
                    className="form-select form-control"
                    placeholder="From"
                    name="origin_contry"
                    onChange={changeData}
                    value={data.origin_contry}
                  >
                    <option disabled selected value={""}>
                      From?
                    </option>
                    {countries.map((country, index) => {
                      return (
                        <option value={country.id} key={index}>
                          {country.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <select
                    className="form-select form-control"
                    placeholder="To"
                    name="destination_contry"
                    onChange={changeData}
                    value={data.destination_contry}
                  >
                    <option disabled selected value={""}>
                      To?
                    </option>
                    {countries.map((country, index) => {
                      return (
                        <option value={country.id} key={index}>
                          {country.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">Departure*</span>
                  <input
                    type="datetime-local"
                    className="form-control"
                    placeholder="Departure"
                    name="departure_time"
                    onChange={changeData}
                    value={data.departure_time}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">Landing*</span>
                  <input
                    type="datetime-local"
                    className="form-control"
                    placeholder="Landing"
                    name="landing_time"
                    onChange={changeData}
                    value={data.landing_time}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">Tickets*</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Remaining Tickets"
                    name="remaining_tickets"
                    onChange={changeData}
                    value={data.remaining_tickets}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="custom-input input-group mb-3">
                  <span className="input-group-text">Price*</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    name="price"
                    onChange={changeData}
                    value={data.price}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="w-100 mt-1 custom-button">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      padding: "12px 15px",
                    }}
                    onClick={addFlight}
                  >
                    Add Flight
                  </button>
                </div>
              </div>
              <p
                className="text-danger p-0 m-0 mb-2"
                id="error"
                style={{ display: "none" }}
              >
                Error
              </p>
            </div>
          </div>
          <div className="my-3"></div>
          <hr />
          <div className="my-5"></div>
          <span className="display-5 mt-4 mb-3 w-100 d-block">
            Recent Flights
          </span>
          <div className="w-100 row">
            <table className="table table-hover table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Origin</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Departure</th>
                  <th scope="col">Landing</th>
                  <th scope="col">Remaining Tickets</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => {
                  return (
                    <tr key={index}>
                      <td>{flight.origin_contry.name}</td>
                      <td>{flight.destination_contry.name}</td>
                      <td>{new Date(flight.departure_time).toUTCString()}</td>
                      <td>{new Date(flight.landing_time).toUTCString()}</td>
                      <td>{flight.remaining_tickets}</td>
                      <td>{flight.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
