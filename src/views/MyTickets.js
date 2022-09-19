import React, { useState, useEffect, useContext } from "react";
import "./../scss/MyFlights.scss";
import { useNavigate } from "react-router-dom";
import UserData from "./../components/UserData";
import { axiosInstance } from "../axiosApi";
import {
  checkLoginFromNonLoginNormal,
  setMessage,
  resetMessage,
} from "../CONSTANT";

export default function MyTickets() {
  let navigate = useNavigate();
  const { session, setSession } = useContext(UserData);
  useEffect(() => {
    if (checkLoginFromNonLoginNormal()) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (session.personal?.id !== "") {
      fetchFlights(session.personal?.id);
    }
  }, [session]);

  const [flights, setFlights] = useState([]);

  const fetchFlights = async (myID) => {
    await axiosInstance
      .get(`api/ticketsById/${myID}`)
      .then((response) => {
        if (response.data.length > 0) {
          setFlights(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="fit-with-navbar __MyFlights">
      <span className="display-5">
        Welcome <b className="text-success">{session.personal?.username}</b>!
      </span>
      <span className="display-5 mt-4 mb-3 w-100 d-block">Recent Tickets</span>
      <div className="w-100 row">
        <table className="table table-hover table-striped table-responsive">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Origin</th>
              <th scope="col">Destination</th>
              <th scope="col">Departure</th>
              <th scope="col">Landing</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight, index) => {
              return (
                <tr key={index}>
                  <td>{flight?.quantity}</td>
                  <td>{flight?.flight_id?.origin_contry.name}</td>
                  <td>{flight?.flight_id?.destination_contry.name}</td>
                  <td>
                    {new Date(flight?.flight_id?.departure_time).toUTCString()}
                  </td>
                  <td>
                    {new Date(flight?.flight_id?.landing_time).toUTCString()}
                  </td>
                  <td>{flight?.flight_id?.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
