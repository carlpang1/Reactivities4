import { ErrorMessage, Field, Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, FormField, Header, Label, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import { format } from "date-fns";
import MyTextInput from "../../../app/common/forms/MyTextInput";
import MyTextArea from "../../../app/common/forms/MyTextArea";
import MySelectInput from "../../../app/common/forms/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOption";
import MyDateInput from "../../../app/common/forms/MyDateInput";
import { Activity } from "../../../app/models/activity";

export default observer(function ActivityForm() {
  const navigate = useNavigate();
  const { activityStore } = useStore();
  const {
    loading,
    loadingInitial,
    loadActivity,
    createActivity,
    updateActivity,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: null,
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
    else
      setActivity({
        id: "",
        title: "",
        category: "",
        description: "",
        date: null,
        city: "",
        venue: "",
      });
  }, [id, loadActivity]);

  // function handleSubmit() {
  //   if (activity.id.length === 0) {
  //     let newActivity = { ...activity, id: uuid() };
  //     createActivity(newActivity).then(() => {
  //       navigate(`/activities/${newActivity.id}`);
  //     });
  //   } else {
  //     updateActivity(activity).then(() => {
  //       navigate(`/activities/${activity.id}`);
  //     });
  //   }
  // }

  // function handleInputChange(
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // }

  function handleFormSubmit(activity: Activity) {}

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required("The activity category is required"),
    date: Yup.string().required("The activity date is required").nullable(),
    venue: Yup.string().required("The activity venue is required"),
    city: Yup.string().required("The activity city is required"),
  });

  if (loadingInitial) return <LoadingComponent content="Loading activity" />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        enableReinitialize
        initialValues={activity}
        validationSchema={validationSchema}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isSubmitting, isValid, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextArea name="description" placeholder="Description" rows={3} />
            <MySelectInput
              name="category"
              placeholder="Category"
              options={categoryOptions}
            />
            <MyDateInput
              name="date"
              placeholderText="Date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />
            <MyTextInput name="venue" placeholder="Venue" />
            <Button
              disabled={isSubmitting || !isValid || !dirty}
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
