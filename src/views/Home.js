import React, { useState, useEffect } from "react";
import "./../scss/Home.scss";
import { CONSTANT } from "./../CONSTANT";
import FlightCard from "../components/FlightCard";
import { axiosInstance } from "../axiosApi";

export default function Home() {
  useEffect(() => {
    fetchCountries();
    fetchFlights();
  }, []);
  const __init = {
    origin_contry: "",
    destination_contry: "",
    departure_time: "",
    landing_time: "",
  };
  const [data, setData] = useState(__init);
  const changeData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const [flights, setFlights] = useState([]);
  const [countries, setCountries] = useState([]);

  const fetchFlights = async (filter = data) => {
    await axiosInstance
      .post(`api/filter`, filter)
      .then((response) => {
        setFlights(response.data);
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
  const applyFilters = async () => {
    fetchFlights();
    document.getElementById("allFlights").scrollIntoView();
  };

  return (
    <div className="__Home">
      <div className="fit-with-navbar homepage">
        <div className="search">
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
                  <option value="" selected>
                    From?
                  </option>{" "}
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
                  <option value="" selected>
                    To?
                  </option>{" "}
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
            <div className="col-lg-6 col-sm-12">
              <div className="w-100 mt-1 custom-button fill">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    padding: "12px 15px",
                  }}
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="w-100 mt-1 custom-button fill">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{
                    padding: "12px 15px",
                  }}
                  onClick={() => {
                    setData(__init);
                    fetchFlights(__init);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100" id="allFlights">
        <div className="row w-100 d-flex p-5">
          {flights.length > 0 ? (
            flights.map((flight, index) => {
              return (
                <div className="col-lg-3 col-sm-12 col-md-4 my-3">
                  <FlightCard flight={flight} index={index} key={index} />
                </div>
              );
            })
          ) : (
            <span className="text-light">No flights available right now.</span>
          )}
        </div>
      </div>
    </div>
  );
}
