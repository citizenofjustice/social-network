import { Box, TextField } from "@mui/material";
import { Formik } from "formik";

const initialValuesLogin = {
  email: "",
  password: "",
};

const AuthDataChangeForm = () => {
  const handleAuthDataChange = () => {};

  return (
    <Box>
      <Formik
        onSubmit={handleAuthDataChange}
        initialValues={initialValuesLogin}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthDataChangeForm;
