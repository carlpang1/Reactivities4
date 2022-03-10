import React from "react";

import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import HomePage from "./home/HomePage";
import { Outlet, Route, Routes } from "react-router-dom";
import ActivityForm from "../../features/activities/forms/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        element={
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Outlet />
            </Container>
          </>
        }
      >
        <Route path="/activities" element={<ActivityDashboard />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path={"/createActivity"} element={<ActivityForm />} />
        <Route path={"/manage/:id"} element={<ActivityForm />} />
      </Route>
    </Routes>
  );
}

export default observer(App);
