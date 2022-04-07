import { Formik, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Form, Header, Label, Button } from "semantic-ui-react";
import MyTextInput from "../../app/common/forms/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from "yup";
import ValidationErrors from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
  const { userStore } = useStore();

  return (
    <Formik
      validationSchema={Yup.object({
        displayname: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
      initialValues={{
        username: "",
        displayname: "",
        email: "",
        password: "",
        error: "",
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form
          className="ui form error"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Header
            as="h2"
            content="Sign up to Reactivities"
            color="teal"
            textAlign="center"
          />
          <MyTextInput name="displayname" placeholder="Display Name" />
          <MyTextInput name="username" placeholder="User Name" />
          <MyTextInput name="email" placeholder="Email" />
          <MyTextInput name="password" placeholder="Password" type="password" />
          <ErrorMessage
            name="error"
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            type="submit"
            loading={isSubmitting}
            positive
            content="Register"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
