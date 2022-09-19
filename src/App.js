import React from "react";
import "./App.scss";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import Home from "./views/Home";
import Layout from "./layout/Layout";
import MyFlights from "./views/MyFlights";
import MyTickets from "./views/MyTickets";
import Details from "./components/Details";
import TakeMeToAdmin from "./components/TakeMeToAdmin";
import Cart from "./views/Cart";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/admin" element={<TakeMeToAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="myFlights"
            element={
              <Layout>
                <MyFlights />
              </Layout>
            }
          />
          <Route
            path="myTickets"
            element={
              <Layout>
                <MyTickets />
              </Layout>
            }
          />
          <Route
            path="cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="details/:id"
            element={
              <Layout>
                <Details />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
