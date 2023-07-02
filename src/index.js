/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "./assets/css/my-css.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { isServiceWorkerRegistered, registerServiceWorker } from "utils/swRegister.js";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import DataReducer from "Stores/DataReducer";

import AppRouter from "routes/router";



if (!isServiceWorkerRegistered() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerServiceWorker();
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = configureStore({
  reducer: {
    perform: DataReducer
  }
})

root.render(
  <Provider store={store}>
    <RouterProvider router={AppRouter} />
  </Provider>
);
