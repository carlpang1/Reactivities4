import { Formik, Form, ErrorMessage } from "formik";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/forms/MyTextInput";
import { useStore } from "../../app/stores/store";

export default function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: "" }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .catch((error) => setErrors({ error: "Invalid email or password" }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
          <Header
            as="h2"
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
          <MyTextInput name="email" placeholder="Email" />
          <MyTextInput name="password" placeholder="Password" type="password" />
          <ErrorMessage
            name="error"
            render={() => (
              <Label
                style={{ marginBottom: 10 }}
                basic
                color="red"
                content={errors.error}
              />
            )}
          />
          <Button
            type="submit"
            loading={isSubmitting}
            positive
            content="Login"
            fluid
          />
        </Form>
      )}
    </Formik>
  );
}
