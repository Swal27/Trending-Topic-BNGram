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
import React, { Component, useState } from "react";
import { useLocation, Route, Outlet } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

import notify from "components/Notification/Notification";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import indexer from "indexer.js";

import sidebarImage from "assets/img/Kuru_Side.jpg";

import { useDispatch } from "react-redux";
import { processAction } from "Stores/ProcessReducer";

function Admin() {
  const notificationAlertRefx = React.useRef(null);
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const dispatch = useDispatch();
 
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);

  React.useEffect(() => {
    navigator.serviceWorker.addEventListener('message', (event) => {
      
      if (event.data && event.data.action === 'dataFetched') {
        const fetchedData = event.data.data;
        // Perform actions based on the received data
        dispatch(processAction.yProcessed());
        notify('success', notificationAlertRefx, 'Process Finished');
      }
    });
  }, [])

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRefx} />
      </div>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={indexer} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Outlet/>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
