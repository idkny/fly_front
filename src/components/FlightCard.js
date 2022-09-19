import React, { useEffect, useState } from "react";
import "./../scss/FlightCard.scss";
import { Link } from "react-router-dom";

export default function FlightCard(props) {
  if (!props.flight) return;

  return (
    <Link to={`/details/${props.flight.id}`} className="__FlightCard">
      <div className={`card auction`}>
        <img
          src={`https://picsum.photos/600?random=${parseInt(props.index) + 1}`}
          className="card-img-top"
          alt={props.flight.origin_contry.name}
        />
        <div className="card-body">
          <div className="row1">
            <span className={`title fw-bold text-muted`}>
              {props.flight.airline_company.name} -{" "}
              <span className="text-danger">{props.flight.price}$</span>
            </span>
          </div>
          <div className="row1 mt-2">
            <span className={`title text-muted`}>
              From{" "}
              <b className="text-success">{props.flight.origin_contry.name}</b>{" "}
              to{" "}
              <b className="text-danger">
                {props.flight.destination_contry.name}
              </b>
            </span>
          </div>
          <div className="row1 mt-2">
            <span className={`title text-muted`}>
              Departure :{" "}
              <b className="text-success">
                {new Date(props.flight.departure_time).toUTCString()}
              </b>
            </span>
          </div>
          <div className="row1 my-2">
            <span className={`title text-muted`}>
              Landing :{" "}
              <b className="text-success">
                {new Date(props.flight.landing_time).toUTCString()}
              </b>
            </span>
          </div>
          <div className="border-top button">
            <span role="button" className="bidButton">
              BOOK TICKET
            </span>
            <span className="timeLeft">
              <b className="me-1">{props.flight.remaining_tickets}</b>tickets
              left
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
