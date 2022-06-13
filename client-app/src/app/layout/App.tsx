import React, { useEffect } from "react";

import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import HomePage from "./home/HomePage";
import { Outlet, Route, Routes } from "react-router-dom";
import ActivityForm from "../../features/activities/forms/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import { ToastContainer } from "react-toastify";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";

function App() {
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
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
          <Route path="/profiles/:username" element={<ProfilePage />} />
          <Route path={"/errors"} element={<TestErrors />} />
          <Route path={"/server-error"} element={<ServerError />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default observer(App);
