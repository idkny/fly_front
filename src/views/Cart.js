import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosApi";
import UserData from "./../components/UserData";
import { checkLoginFromNonLoginNormal } from "../CONSTANT";

export default function Cart() {
  const { session, setSession } = useContext(UserData);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFlights();
    setCart(JSON.parse(localStorage.getItem("myCart")) ?? []);
  }, []);
  const [cart, setCart] = useState([]);
  const [flights, setFlights] = useState([]);
  const fetchFlights = async () => {
    await axiosInstance
      .get(`api/flights`)
      .then((response) => {
        if (response.data.length > 0) {
          setFlights(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTotal = () => {
    let total = 0;
    cart.map((id, one) => {
      let myFlight = flights.filter((flight, two) => {
        return id.id === flight.id;
      });
      if (myFlight.length > 0) {
        total += parseInt(myFlight[0].price) * parseInt(id.quantity);
      }
    });
    return total;
  };

  const checkout = async () => {
    cart.map(async (id, one) => {
      await axiosInstance
        .post(`api/tickets`, {
          flight_id: id.id,
          customer_id: session.personal?.id,
          quantity: parseInt(id.quantity),
        })
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    });
    localStorage.removeItem("myCart");
    navigate("/myTickets");
  };

  return (
    <div className="fit-with-navbar __Cart">
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-7">
                      <h5 className="mb-3">My Cart</h5>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <p className="mb-0">
                            You have{" "}
                            {cart?.reduce(function (sum, current) {
                              return parseInt(sum) + parseInt(current.quantity);
                            }, 0)}{" "}
                            tickets in your cart
                          </p>
                        </div>
                      </div>
                      {cart.map((id, one) => {
                        let myFlight = flights.filter((flight, two) => {
                          return id.id === flight.id;
                        });
                        myFlight = myFlight.length > 0 ? myFlight[0] : null;
                        return (
                          <div className="card mb-3" key={one}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row align-items-center">
                                  <div>
                                    <img
                                      src={`https://picsum.photos/600?random=${
                                        parseInt(one) + 1
                                      }`}
                                      className="img-fluid rounded-3"
                                      alt="Shopping item"
                                      style={{ width: "65px" }}
                                    />
                                  </div>
                                  <div className="ms-3">
                                    <h5>
                                      <span className={`title text-muted`}>
                                        From{" "}
                                        <b className="text-success">
                                          {myFlight?.origin_contry.name}
                                        </b>{" "}
                                        to{" "}
                                        <b className="text-danger">
                                          {myFlight?.destination_contry.name}
                                        </b>
                                      </span>
                                    </h5>
                                    <p className="small mb-0">
                                      {myFlight?.airline_company.name}
                                    </p>
                                    <p className="small mb-0">
                                      {new Date(
                                        myFlight?.departure_time
                                      ).toUTCString()}{" "}
                                      -{" "}
                                      {new Date(
                                        myFlight?.landing_time
                                      ).toUTCString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex flex-row align-items-center">
                                  <div style={{ width: "50px" }}>
                                    <h5 className="fw-normal mb-0">
                                      {id.quantity}
                                    </h5>
                                  </div>
                                  <div style={{ width: "80px" }}>
                                    <h5 className="mb-0 text-danger">
                                      ${myFlight?.price}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="col-lg-5">
                      <div className="card rounded-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0">Ticket holder details</h5>
                            <img
                              src="https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?b=1&k=20&m=476085198&s=170667a&w=0&h=Ct4e1kIOdCOrEgvsQg4A1qeuQv944pPFORUQcaGw4oI="
                              className="img-fluid rounded-3"
                              style={{ width: "45px" }}
                              alt="Avatar"
                            />
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Name</p>
                            <p className="mb-2">
                              {session.personal?.first_name}{" "}
                              {session.personal?.last_name} - (
                              {session.personal?.username})
                            </p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Email</p>
                            <p className="mb-2">{session.personal?.email}</p>
                          </div>
                          <hr className="my-4" />
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Subtotal</p>
                            <p className="mb-2">${getTotal()}.00</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Shipping</p>
                            <p className="mb-2">$20.00</p>
                          </div>
                          <div className="d-flex justify-content-between mb-4">
                            <p className="mb-2">Total(Incl. taxes)</p>
                            <p className="mb-2">${getTotal() + 20}.00</p>
                          </div>
                          <div className="w-100 mt-1 custom-button">
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{
                                padding: "12px 15px",
                              }}
                              disabled={session.personal?.role === ""}
                              onClick={checkout}
                            >
                              {session.personal?.role === ""
                                ? "Login to Checkout"
                                : "Checkout"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
